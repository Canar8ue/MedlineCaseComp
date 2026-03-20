import pandas as pd
import sys
import io

# redirect stdout to a utf-8 file
sys.stdout = io.open(r"f:\CaseComp\output.txt", "w", encoding="utf-8")

def inspect():
    print("--- File Column Definitions.xlsx ---")
    try:
        xls = pd.ExcelFile(r"f:\CaseComp\File Column Definitions.xlsx")
        for sheet_name in xls.sheet_names:
            print(f"\nSheet: {sheet_name}")
            df = pd.read_excel(xls, sheet_name=sheet_name)
            print(df.head(20).to_string())
    except Exception as e:
        print(f"Error reading File Column Definitions: {e}")
        
    print("\n\n--- KnownSubstituteRelationships.csv ---")
    try:
        df_sub = pd.read_csv(r"f:\CaseComp\KnownSubstituteRelationships.csv", nrows=10)
        print("Columns:", list(df_sub.columns))
        print(df_sub.head().to_string())
    except Exception as e:
        print(f"Error: {e}")

    print("\n\n--- ManufacturerBackOrderData2025.xlsx ---")
    try:
        df_back = pd.read_excel(r"f:\CaseComp\ManufacturerBackOrderData2025.xlsx", nrows=10)
        print("Columns:", list(df_back.columns))
        print(df_back.head().to_string())
    except Exception as e:
        print(f"Error: {e}")

    print("\n\n--- WeeklyItemStockLevels.csv (First 50 Rows) ---")
    try:
        df_stock = pd.read_csv(r"f:\CaseComp\WeeklyItemStockLevels.csv", nrows=50)
        print("Columns:", list(df_stock.columns))
        print(df_stock.head().to_string())
    except Exception as e:
        print(f"Error: {e}")

    print("\n\n--- WeeklyMaterialSalesServiceQuantities2025.csv (First 50 Rows) ---")
    try:
        df_sales = pd.read_csv(r"f:\CaseComp\WeeklyMaterialSalesServiceQuantities2025.csv", nrows=50)
        print("Columns:", list(df_sales.columns))
        print(df_sales.head().to_string())
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    inspect()
