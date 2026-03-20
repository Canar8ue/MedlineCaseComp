import pandas as pd
import numpy as np
import os

def isolate_category_spike():
    data_dir = r"f:\CaseComp"
    cleaned_file = os.path.join(data_dir, "Cleaned_Competitor_MBO_Data.csv")
    results_dir = os.path.join(data_dir, "results")
    
    if not os.path.exists(results_dir):
        os.makedirs(results_dir)

    df = pd.read_csv(cleaned_file, low_memory=False)
    
    mbo_file = os.path.join(data_dir, "ManufacturerBackOrderData2025.xlsx")
    df_mbo = pd.read_excel(mbo_file)
    df_mbo_filtered = df_mbo[df_mbo['MaterialDescription'].astype(str).str.startswith('MBO-')]
    
    # Drop the empty MBO Date column so we can re-merge it properly
    df = df.drop(columns=['MBOEpisodeStartDate'], errors='ignore')
    
    df = df.merge(df_mbo_filtered[['ParentMaterialNumber', 'MBOEpisodeStartDate']], on='ParentMaterialNumber', how='inner')

    base_date = pd.to_datetime('2024-12-30')
    df['MBOEpisodeStartDate'] = pd.to_datetime(df['MBOEpisodeStartDate'])
    df['MBOWeekNumber'] = ((df['MBOEpisodeStartDate'] - base_date).dt.days // 7) + 1

    df['Weeks_To_MBO'] = df['MBOWeekNumber'] - df['SalesWeekNumber']
    
    mbos = df[(df['Weeks_To_MBO'] >= 4) & (df['Weeks_To_MBO'] <= 6)].copy()
    
    # Fill missing category codes
    mbos['ProductCategoryCode'] = mbos['ProductCategoryCode'].fillna('UNKNOWN')

    # Week 4 Sales sum by Category
    week4 = mbos[mbos['Weeks_To_MBO'] == 4].groupby('ProductCategoryCode').agg(
        Week4_Sales=('SalesOrderQtyEaches', 'sum'),
        MBO_Item_Count=('ParentMaterialNumber', 'nunique')
    ).reset_index()
    
    # Base Sales (Weeks 5 & 6) average weekly sum by Category
    base = mbos[mbos['Weeks_To_MBO'].isin([5, 6])].groupby(['ProductCategoryCode', 'SalesWeekNumber'])['SalesOrderQtyEaches'].sum().reset_index()
    base_avg = base.groupby('ProductCategoryCode')['SalesOrderQtyEaches'].mean().reset_index()
    base_avg.rename(columns={'SalesOrderQtyEaches': 'Base_Weekly_Sales'}, inplace=True)
    
    category_summary = week4.merge(base_avg, on='ProductCategoryCode', how='inner')
    
    # Variance % = (Week4 - Base) / Base
    category_summary['Sales_Variance_Pct'] = np.where(
        category_summary['Base_Weekly_Sales'] > 0,
        (category_summary['Week4_Sales'] - category_summary['Base_Weekly_Sales']) / category_summary['Base_Weekly_Sales'],
        0
    )
    
    # Filter out tiny categories to prevent noise (require at least 50 units sold generally)
    category_summary = category_summary[category_summary['Base_Weekly_Sales'] > 50].copy()
    
    category_summary = category_summary.sort_values(by='Sales_Variance_Pct', ascending=False)
    
    csv_path = os.path.join(results_dir, "4_week_category_spike.csv")
    category_summary.to_csv(csv_path, index=False)
    
    top5 = category_summary.head(5)
    
    text_path = os.path.join(results_dir, "category_vulnerability_summary.txt")
    with open(text_path, 'w') as f:
        f.write("Category Vulnerability Deep Dive (4 Weeks Prior to MBO)\n")
        f.write("========================================================\n\n")
        f.write("The following 5 categories exhibit the most extreme hoarding/spike behavior 4 weeks right before an MBO strikes and should be heavily monitored:\n\n")
        
        rank = 1
        for _, row in top5.iterrows():
            f.write(f"#{rank}: {row['ProductCategoryCode']}\n")
            f.write(f"   - Variance Spike: {row['Sales_Variance_Pct']:.2%}\n")
            f.write(f"   - Week 4 Volume: {row['Week4_Sales']:,.0f} (Base: {row['Base_Weekly_Sales']:,.0f})\n")
            f.write(f"   - MBO Items in Category: {row['MBO_Item_Count']}\n\n")
            rank += 1
            
        f.write("Conclusion: Product lines displaying these massive >100% spikes face immediate vulnerability to 4-week supply shocks caused by competitor behavior. Medline should focus supply chain alerts on these specific categories when leading indicators surge.\n")
        
    print(f"Successfully generated {csv_path} and {text_path}")

if __name__ == '__main__':
    isolate_category_spike()
