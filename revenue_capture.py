import pandas as pd
import numpy as np
import os

def calculate_revenue_capture():
    data_dir = r"f:\CaseComp"
    cleaned_file = os.path.join(data_dir, "Cleaned_Competitor_MBO_Data.csv")
    substitute_file = os.path.join(data_dir, "KnownSubstituteRelationships.csv")
    results_dir = os.path.join(data_dir, "results")
    
    if not os.path.exists(results_dir):
        os.makedirs(results_dir)

    df = pd.read_csv(cleaned_file, low_memory=False)
    subs_df = pd.read_csv(substitute_file)
    
    mbo_file = os.path.join(data_dir, "ManufacturerBackOrderData2025.xlsx")
    df_mbo = pd.read_excel(mbo_file)
    df_mbo_filtered = df_mbo[df_mbo['MaterialDescription'].astype(str).str.startswith('MBO-')]
    
    df = df.drop(columns=['MBOEpisodeStartDate'], errors='ignore')
    df = df.merge(df_mbo_filtered[['ParentMaterialNumber', 'MBOEpisodeStartDate']], on='ParentMaterialNumber', how='inner')

    base_date = pd.to_datetime('2024-12-30')
    df['MBOEpisodeStartDate'] = pd.to_datetime(df['MBOEpisodeStartDate'])
    df['MBOWeekNumber'] = ((df['MBOEpisodeStartDate'] - base_date).dt.days // 7) + 1

    df['Weeks_To_MBO'] = df['MBOWeekNumber'] - df['SalesWeekNumber']
    
    # Filter for the 4-week hoarding window
    window_df = df[(df['Weeks_To_MBO'] >= 1) & (df['Weeks_To_MBO'] <= 4)].copy()
    
    # Identify Substitutable MBOs
    subs_df['MaterialNumber'] = subs_df['MaterialNumber'].astype(str)
    window_df['ParentMaterialNumber'] = window_df['ParentMaterialNumber'].astype(str)
    
    substitutable_items = subs_df['MaterialNumber'].unique()
    window_df = window_df[window_df['ParentMaterialNumber'].isin(substitutable_items)]
    
    # Calculate Total Addressable Revenue
    # Since there is no Unit Price in the dataset, we use an estimated baseline of $50 per unit.
    ESTIMATED_UNIT_PRICE = 50.0
    window_df['Addressable_Revenue'] = window_df['SalesOrderQtyEaches'] * ESTIMATED_UNIT_PRICE
    
    # Aggregate by Category
    window_df['ProductCategoryCode'] = window_df['ProductCategoryCode'].fillna('UNKNOWN')
    category_rev = window_df.groupby('ProductCategoryCode').agg(
        Addressable_Revenue=('Addressable_Revenue', 'sum'),
        Total_Units_Sold=('SalesOrderQtyEaches', 'sum')
    ).reset_index()
    
    total_addressable_revenue = category_rev['Addressable_Revenue'].sum()
    
    # Scenarios
    category_rev['Conservative_10_Pct'] = category_rev['Addressable_Revenue'] * 0.10
    category_rev['Moderate_25_Pct'] = category_rev['Addressable_Revenue'] * 0.25
    category_rev['Aggressive_50_Pct'] = category_rev['Addressable_Revenue'] * 0.50
    
    category_rev = category_rev.sort_values('Moderate_25_Pct', ascending=False)
    
    csv_path = os.path.join(results_dir, "revenue_capture_by_category.csv")
    category_rev.to_csv(csv_path, index=False)
    
    # Summary text
    cons_capture = total_addressable_revenue * 0.10
    mod_capture = total_addressable_revenue * 0.25
    agg_capture = total_addressable_revenue * 0.50
    
    top5 = category_rev.head(5)
    
    text_path = os.path.join(results_dir, "financial_impact_summary.txt")
    with open(text_path, 'w') as f:
        f.write("Financial Impact & Revenue Capture Analysis (4-Week Hoarding Window)\n")
        f.write("=====================================================================\n\n")
        f.write("Note: Based on dataset availability, Addressable Revenue was calculated using an estimated baseline of $50 per unit. Variables scale linearly to custom ASPs.\n\n")
        
        f.write(f"Total Addressable Revenue (Spiked Volume of Substitutable Items): ${total_addressable_revenue:,.2f}\n\n")
        
        f.write("Revenue Capture Scenarios:\n")
        f.write(f"  - Conservative (10% Capture): ${cons_capture:,.2f}\n")
        f.write(f"  - MODERATE (25% Capture)    : ${mod_capture:,.2f}\n")
        f.write(f"  - Aggressive (50% Capture)  : ${agg_capture:,.2f}\n\n")
        
        f.write("Moderate (25%) Revenue Capture Breakdown by Top 5 Substitutable Categories:\n")
        f.write("-----------------------------------------------------------------------\n")
        rank = 1
        for _, row in top5.iterrows():
            f.write(f"#{rank}: {row['ProductCategoryCode']}\n")
            f.write(f"   - 25% Captured Revenue: ${row['Moderate_25_Pct']:,.2f}\n")
            f.write(f"   - Addressable Revenue:  ${row['Addressable_Revenue']:,.2f}\n\n")
            rank += 1
            
        f.write("Conclusion: By accurately deploying predictive substitute marketing strictly to the items within the 4-week hoarding window that possess a direct Medline cross-reference, Medline stands to capture significant market share exactly when the competitor's supply chain fails.\n")
        
    print(f"Successfully generated {csv_path} and {text_path}")

if __name__ == '__main__':
    calculate_revenue_capture()
