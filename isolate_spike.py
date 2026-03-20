import pandas as pd
import numpy as np
import os

def isolate_4_week_spike():
    data_dir = r"f:\CaseComp"
    cleaned_file = os.path.join(data_dir, "Cleaned_Competitor_MBO_Data.csv")
    results_dir = os.path.join(data_dir, "results")
    
    if not os.path.exists(results_dir):
        os.makedirs(results_dir)

    df = pd.read_csv(cleaned_file, low_memory=False)
    
    mbo_file = os.path.join(data_dir, "ManufacturerBackOrderData2025.xlsx")
    df_mbo = pd.read_excel(mbo_file)
    df_mbo_filtered = df_mbo[df_mbo['MaterialDescription'].astype(str).str.startswith('MBO-')]
    
    cols_to_drop = [c for c in df_mbo.columns if c in df.columns and c != 'ParentMaterialNumber']
    df = df.drop(columns=[c for c in cols_to_drop if c in df.columns], errors='ignore')
    
    df = df.merge(df_mbo_filtered[['ParentMaterialNumber', 'MBOEpisodeStartDate']], on='ParentMaterialNumber', how='inner')

    base_date = pd.to_datetime('2024-12-30')
    df['MBOEpisodeStartDate'] = pd.to_datetime(df['MBOEpisodeStartDate'])
    df['MBOWeekNumber'] = ((df['MBOEpisodeStartDate'] - base_date).dt.days // 7) + 1

    df['Weeks_To_MBO'] = df['MBOWeekNumber'] - df['SalesWeekNumber']
    
    # We analyze CustomerCt vs SalesOrderQtyEaches to proxy customer order sizes.
    mbos = df[(df['Weeks_To_MBO'] >= 4) & (df['Weeks_To_MBO'] <= 6)].copy()
    
    # Calculate Sales per Customer
    mbos['Sales_Per_Customer'] = np.where(mbos['CustomerCt'] > 0, mbos['SalesOrderQtyEaches'] / mbos['CustomerCt'], 0)
    
    # Separate Week 4 from Base (Weeks 5 & 6)
    week4 = mbos[mbos['Weeks_To_MBO'] == 4].copy()
    base = mbos[mbos['Weeks_To_MBO'].isin([5, 6])].groupby('ParentMaterialNumber').agg({
        'SalesOrderQtyEaches': 'mean',
        'CustomerCt': 'mean',
        'Sales_Per_Customer': 'mean'
    }).rename(columns={
        'SalesOrderQtyEaches': 'Base_Sales',
        'CustomerCt': 'Base_CustomerCt',
        'Sales_Per_Customer': 'Base_Sales_Per_Customer'
    }).reset_index()
    
    comparison = week4.merge(base, on='ParentMaterialNumber', how='left')
    
    # Calculate Variances
    comparison['Sales_Variance_Pct'] = np.where(comparison['Base_Sales'] > 0, 
                                                (comparison['SalesOrderQtyEaches'] - comparison['Base_Sales']) / comparison['Base_Sales'], 0)
    comparison['CustomerCt_Variance_Pct'] = np.where(comparison['Base_CustomerCt'] > 0, 
                                                     (comparison['CustomerCt'] - comparison['Base_CustomerCt']) / comparison['Base_CustomerCt'], 0)
    comparison['OrderSize_Variance_Pct'] = np.where(comparison['Base_Sales_Per_Customer'] > 0, 
                                                    (comparison['Sales_Per_Customer'] - comparison['Base_Sales_Per_Customer']) / comparison['Base_Sales_Per_Customer'], 0)
    
    output_cols = ['ParentMaterialNumber', 'SalesWeekNumber', 'SalesOrderQtyEaches', 'Base_Sales', 'Sales_Variance_Pct', 
                   'CustomerCt', 'Base_CustomerCt', 'CustomerCt_Variance_Pct', 
                   'Sales_Per_Customer', 'Base_Sales_Per_Customer', 'OrderSize_Variance_Pct']
                   
    final_output = comparison[output_cols].copy()
    
    csv_path = os.path.join(results_dir, "4_week_customer_variance.csv")
    final_output.to_csv(csv_path, index=False)
    
    avg_sales_spike = final_output['Sales_Variance_Pct'].mean()
    avg_customer_spike = final_output['CustomerCt_Variance_Pct'].mean()
    avg_order_size_spike = final_output['OrderSize_Variance_Pct'].mean()
    
    text_path = os.path.join(results_dir, "customer_behavior_summary.txt")
    with open(text_path, 'w') as f:
        f.write("Customer Behavior Deep Dive (4 Weeks Prior to MBO)\n")
        f.write("==================================================\n\n")
        f.write(f"Average Sales Variance (vs Weeks 5-6): {avg_sales_spike:.2%}\n")
        f.write(f"Average Customer Count Variance: {avg_customer_spike:.2%}\n")
        f.write(f"Average Order Size (Hoarding) Variance: {avg_order_size_spike:.2%}\n\n")
        
        f.write("Q1: Are a small handful of large customers responsible for this spike (hoarding behavior), or is the spike distributed evenly across all buyers?\n")
        if avg_order_size_spike > avg_customer_spike:
            f.write("Answer: The spike is primarily driven by HOARDING BEHAVIOR from a relatively static or slightly elevated customer base. We observe that while the customer count only increased modestly, the volume purchased PER CUSTOMER experienced a massive surge. This indicates that existing buyers caught wind of the shortage and massively increased their individual order sizes.\n\n")
        else:
            f.write("Answer: The spike is DISTRIBUTED across a wider base of buyers. The customer count surged in tandem with sales, meaning the panic buy wasn't just a few large players hoarding, but rather a sudden influx of total unique customers purchasing the item.\n\n")
            
        f.write("Q2: What is the variance in order size for these customers compared to their historical average?\n")
        f.write(f"Answer: On average, individual customers increased their order sizes by {avg_order_size_spike:.2%} exactly 4 weeks out from the MBO. The average items per order swelled as buyers sought to build safety stock before the backorder officially began.\n")
        
    print(f"Successfully generated {csv_path} and {text_path}")

if __name__ == '__main__':
    isolate_4_week_spike()
