import pandas as pd
import os

def reduce_and_merge_data():
    data_dir = r"f:\CaseComp"
    stock_file = os.path.join(data_dir, "WeeklyItemStockLevels.csv")
    sales_file = os.path.join(data_dir, "WeeklyMaterialSalesServiceQuantities2025.csv")
    mbo_file = os.path.join(data_dir, "ManufacturerBackOrderData2025.xlsx")
    output_file = os.path.join(data_dir, "Cleaned_Competitor_MBO_Data.csv")

    print("Step 1: Processing Weekly Stock Data (Chunking 2GB+ file)...")
    stock_chunks = []
    # Filter conditions: MedlineBrandInd == 'Competitor Distributed Product'
    for chunk in pd.read_csv(stock_file, chunksize=250000, low_memory=False):
        filtered_chunk = chunk[chunk['MedlineBrandInd'] == 'Competitor Distributed Product']
        stock_chunks.append(filtered_chunk)
    df_stock = pd.concat(stock_chunks, ignore_index=True)
    print(f"  -> Filtered Stock Data Shape: {df_stock.shape}")

    print("Step 2: Processing Weekly Sales Data (Chunking 2GB+ file)...")
    sales_chunks = []
    for chunk in pd.read_csv(sales_file, chunksize=250000, low_memory=False):
        filtered_chunk = chunk[chunk['MedlineBrandInd'] == 'Competitor Distributed Product']
        sales_chunks.append(filtered_chunk)
    df_sales = pd.concat(sales_chunks, ignore_index=True)
    print(f"  -> Filtered Sales Data Shape: {df_sales.shape}")

    print("Step 3: Processing Manufacturer BackOrder Data...")
    df_mbo = pd.read_excel(mbo_file)
    
    # Isolate primary shortages identified by literal prefix "MBO-"
    # Searching for "MBO-" inside the likely identity columns if not explicitly clear
    mbo_mask = (
        df_mbo['MBOEpisodeNumber'].astype(str).str.startswith('MBO-') | 
        df_mbo['MBOEpisodeType'].astype(str).str.startswith('MBO-')
    )
    df_mbo_filtered = df_mbo[mbo_mask]
    
    # Fallback: if the prefix is "MBO-" but we aren't finding it in the type or number natively, 
    # we can try applying it across the whole dataframe row or adjusting the column. 
    # For now, relying on the logic where the identifier explicitly starts with 'MBO-'
    print(f"  -> Filtered MBO Data Shape: {df_mbo_filtered.shape} (Original: {df_mbo.shape})")

    print("Step 4: Merging Datasets...")
    # First, merge Stock and Sales cleanly on Item ID and Week
    # We'll use an outer join to capture stock records without sales, and sales without stock.
    # Overlapping columns (like WeekStartDate) will be suffixed or used as join keys.
    common_stock_sales_keys = ['ParentMaterialNumber', 'SalesWeekNumber']
    
    # To prevent duplicate column names, filter out the overlapping redundant descriptive columns before merge
    # such as 'MaterialDescription', 'MedlineBrandInd'
    cols_to_drop_from_sales = [col for col in df_sales.columns if col in df_stock.columns and col not in common_stock_sales_keys]
    df_sales_clean = df_sales.drop(columns=cols_to_drop_from_sales)

    df_merged_weekly = pd.merge(df_stock, df_sales_clean, on=common_stock_sales_keys, how='outer')

    # Merge BackOrder data on Item ID 
    # (Since MBO is episode-based without a specific Week number, we left-join it by ParentMaterialNumber)
    cols_to_drop_from_mbo = [col for col in df_mbo_filtered.columns if col in df_merged_weekly.columns and col != 'ParentMaterialNumber']
    df_mbo_clean = df_mbo_filtered.drop(columns=cols_to_drop_from_mbo)
    
    df_final = pd.merge(df_merged_weekly, df_mbo_clean, on='ParentMaterialNumber', how='left')

    print(f"  -> Consolidated Data Shape: {df_final.shape}")

    print("Step 5: Exporting Final DataFrame...")
    df_final.to_csv(output_file, index=False)
    print(f"Successfully exported cleaned data to: {output_file}")


if __name__ == "__main__":
    reduce_and_merge_data()
