import pandas as pd
import numpy as np
import os

def calculate_features():
    data_dir = r"f:\CaseComp"
    cleaned_file = os.path.join(data_dir, "Cleaned_Competitor_MBO_Data.csv")
    substitute_file = os.path.join(data_dir, "KnownSubstituteRelationships.csv")

    if not os.path.exists(cleaned_file):
        print(f"File not found: {cleaned_file}")
        return

    print("Loading datasets...")
    df = pd.read_csv(cleaned_file)
    subs_df = pd.read_csv(substitute_file)
    
    # Reload and properly filter MBO data without rerunning the 4GB reduction
    mbo_file = os.path.join(data_dir, "ManufacturerBackOrderData2025.xlsx")
    df_mbo = pd.read_excel(mbo_file)
    df_mbo_filtered = df_mbo[df_mbo['MaterialDescription'].astype(str).str.startswith('MBO-')]
    
    # Drop old MBO columns from df
    cols_to_drop = [c for c in df_mbo.columns if c in df.columns and c != 'ParentMaterialNumber']
    df = df.drop(columns=[c for c in cols_to_drop if c in df.columns], errors='ignore')
    
    # Remerge proper MBO data
    df = df.merge(df_mbo_filtered[['ParentMaterialNumber', 'MBOEpisodeStartDate']], on='ParentMaterialNumber', how='left')

    # Calculate MBO Week Number
    # Week 1 started 2024-12-30
    base_date = pd.to_datetime('2024-12-30')
    df['MBOEpisodeStartDate'] = pd.to_datetime(df['MBOEpisodeStartDate'])
    df['MBOWeekNumber'] = ((df['MBOEpisodeStartDate'] - base_date).dt.days // 7) + 1

    # Filter to only episodes that have an MBO
    # The reduced dataset already has left-joined MBO data, but we need items that ACTUALLY have MBOs
    mbos = df.dropna(subset=['MBOEpisodeStartDate']).copy()

    print(f"Items with MBO start dates: {mbos['ParentMaterialNumber'].nunique()}")

    # Add primary key to self join
    mbos = mbos.sort_values(['ParentMaterialNumber', 'SalesWeekNumber'])

    # Calculate basic WoW features
    mbos['Prev_Stock'] = mbos.groupby('ParentMaterialNumber')['EndofWeekUnrestrictedStock'].shift(1)
    mbos['Prev_Sales'] = mbos.groupby('ParentMaterialNumber')['SalesOrderQtyEaches'].shift(1)

    # 1. Burn Rate (Stock depletion % WoW)
    # If stock dropped from 100 to 80, depletion is (100-80)/100 = 20%
    mbos['Burn_Rate'] = np.where(mbos['Prev_Stock'] > 0, 
                                 (mbos['Prev_Stock'] - mbos['EndofWeekUnrestrictedStock']) / mbos['Prev_Stock'], 
                                 0)

    # 2. Panic Buy (Sales Spike % WoW)
    # If sales jumped from 50 to 100, spike is (100-50)/50 = 100%
    mbos['Panic_Buy'] = np.where(mbos['Prev_Sales'] > 0,
                                 (mbos['SalesOrderQtyEaches'] - mbos['Prev_Sales']) / mbos['Prev_Sales'],
                                 0)

    # Map substitutes to their sales
    # Get sales per item per week
    sales_per_item_week = df.groupby(['ParentMaterialNumber', 'SalesWeekNumber'])['SalesOrderQtyEaches'].sum().reset_index()
    sales_per_item_week.rename(columns={'ParentMaterialNumber': 'SubstituteMaterialNumber', 'SalesOrderQtyEaches': 'SalesOrderQtyEaches_sub'}, inplace=True)

    # Find substitutes for each MBO item
    mbo_items = mbos[['ParentMaterialNumber', 'SalesWeekNumber', 'EndofWeekUnrestrictedStock']].copy()
    mbo_subs = mbo_items.merge(subs_df, left_on='ParentMaterialNumber', right_on='MaterialNumber', how='inner')
    
    # Merge substitute sales for the same week
    mbo_subs = mbo_subs.merge(sales_per_item_week, on=['SubstituteMaterialNumber', 'SalesWeekNumber'], how='left')
    
    mbo_subs['SalesOrderQtyEaches_sub'] = mbo_subs['SalesOrderQtyEaches_sub'].fillna(0)
    
    # Calculate prev sub sales
    mbo_subs = mbo_subs.sort_values(['ParentMaterialNumber', 'SubstituteMaterialNumber', 'SalesWeekNumber'])
    mbo_subs['Prev_Sub_Sales'] = mbo_subs.groupby(['ParentMaterialNumber', 'SubstituteMaterialNumber'])['SalesOrderQtyEaches_sub'].shift(1)
    
    mbo_subs['Sub_Spike'] = np.where(mbo_subs['Prev_Sub_Sales'] > 0,
                                     (mbo_subs['SalesOrderQtyEaches_sub'] - mbo_subs['Prev_Sub_Sales']) / mbo_subs['Prev_Sub_Sales'],
                                     0)
    
    mbo_subs['Sub_Shift_Condition'] = (mbo_subs['Sub_Spike'] > 0.2) & (mbo_subs['EndofWeekUnrestrictedStock'] > 0)

    # Aggregate substitute shifts back to the primary item-week level
    shift_agg = mbo_subs.groupby(['ParentMaterialNumber', 'SalesWeekNumber'])['Sub_Shift_Condition'].max().reset_index()
    shift_agg.rename(columns={'Sub_Shift_Condition': 'Substitute_Shift'}, inplace=True)

    mbos = mbos.merge(shift_agg, on=['ParentMaterialNumber', 'SalesWeekNumber'], how='left')
    mbos['Substitute_Shift'] = mbos['Substitute_Shift'].fillna(False)

    # Determine Weeks to MBO
    mbos['Weeks_To_MBO'] = mbos['MBOWeekNumber'] - mbos['SalesWeekNumber']

    # Filter for 1 to 6 weeks preceding
    lead_time_df = mbos[(mbos['Weeks_To_MBO'] >= 1) & (mbos['Weeks_To_MBO'] <= 6)]

    print("\n--- Statistical Summary: 1-6 Weeks Prior to MBO ---")
    summary = []
    for w in range(6, 0, -1):
        week_data = lead_time_df[lead_time_df['Weeks_To_MBO'] == w]
        if len(week_data) == 0:
            continue
        
        avg_burn = week_data['Burn_Rate'].mean()
        avg_panic = week_data['Panic_Buy'].mean()
        pct_sub_shift = week_data['Substitute_Shift'].mean()
        
        summary.append({
            'Weeks_Prior': w,
            'Avg_Burn_Rate': f"{avg_burn:.2%}",
            'Avg_Panic_Buy': f"{avg_panic:.2%}",
            'Pct_Sub_Shift': f"{pct_sub_shift:.2%}",
            'Sample_Size': len(week_data)
        })
    
    summary_df = pd.DataFrame(summary)
    
    if not summary_df.empty:
        summary_df.to_csv(os.path.join(data_dir, "summary_results.csv"), index=False)
        print("Exported summary_results.csv")
        print("\nAnalysis Conclusion:")
        print("By observing the trends from Week 6 down to Week 1 prior to the MBO:")
        print("- An increasing Burn Rate indicates stock depleting more rapidly.")
        print("- An increasing Panic Buy signals customers stocking up.")
        print("- A rising Substitute Shift % means customers are exploring alternatives BEFORE the primary item hits 0 stock.")
        print("Typically, the largest jump in these indicators will reveal the optimal predictive window (often 2-4 weeks prior).")
    else:
        print("No historical data available 1-6 weeks prior for the filtered MBOs.")

if __name__ == "__main__":
    calculate_features()
