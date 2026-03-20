# Case Competition

setwd("~/Documents/BYU/Winter 2026 Semester/Case Competition")

library(tidyverse)
library(ggplot2)

backorder <- readxl::read_excel("ManufacturerBackOrderData2025.xlsx")
sales_service <- vroom::vroom("ManufacturerBackOrderData2025.csv")
stock <- vroom::vroom("WeeklyItemStockLevels.csv")

# Questions Outline ---------------------------------------------------------------

## Main Question  
# Predicting competitor product shortages before they occur, what are the precursors or patterns in the data that proceeded past shortages? Recommendations for how Medline can prepare for those shortages.
# Conceptual Model:
  # something ----> product shortages
# Plan
  # Step 1:
  # Create a linear model
  # Then create an arima and a prophet mode
  # Do a time series cross validation and look at rmse (lower = better) and compare the arima vs prophet
  # Then plot the prediction based on whichever one is better

## Other Questions
# How accurate are we at predicting the week or month an MBO will occur on competitor distributed products?
# How early from the MBO start date can we typically get an accurate prediction on competitor distributed products?
# What types of customer behavior do we see on the MBO item that proceeds an MBO on competitor distributed products?
# How many different types of MBO can we identify and are there potentially different methods to predict each one on competitor distributed products?
# Sometimes an MBO can really start before the listed MBO Start Date in the data. Can we improve how quickly we alert people that a competitor distributed

# Do you notice any other interesting customer, stock, category or material trends in the data and do you have insights or recommendations for Medline?


# Main Question -----------------------------------------------------------
## EDA
colnames(backorder)
colnames(sales_service)
colnames(stock)

# EndofWeekTotalBackOrderQty -> unfulfilled demand (high = shortage)
# EndofWeekUnrestrictedStock → what you have
# EndofWeekIntransitStock → what’s coming
# EndofWeekOpenVendorPOStock → what you ordered
# EndofWeekOpenSalesOrderStock → demand pressure

# I want to merge my datasets into one
shortages <- merge(x = sales_service,
                   y = stock,
                   by = c("ParentMaterialNumber", "WeekStartDate"),
                   all = FALSE)

table(shortages$WeekStartDate)
table(shortages$ParentMaterialNumber)

# I'm going to create a shortage variable to make it easier
shortages$shortage <- shortages$EndofWeekTotalBackOrderQty


# since the dataset is so large I am going to sample from it
shortages_agg <- shortages %>%
  group_by(WeekStartDate, ProductDivision = ProductDivision.y) %>%
  summarise(
    shortage   = mean(shortage, na.rm = TRUE),
    demand     = mean(SalesOrderQtyEaches, na.rm = TRUE),
    intransit  = mean(EndofWeekIntransitStock, na.rm = TRUE),
    vendor_po  = mean(EndofWeekOpenVendorPOStock, na.rm = TRUE),
    fill_rate  = mean(StockQtyFillRatePerc, na.rm = TRUE),
    customers  = mean(CustomerCt, na.rm = TRUE),
    .groups = "drop"
  )

table(shortages_agg$WeekStartDate)

ggplot(shortages_agg, aes(x = WeekStartDate, y = shortage)) + 
  geom_point()

model1 <- lm(shortage ~ 
               demand +
               intransit +
               vendor_po +
               fill_rate +
               customers +
               ProductDivision,
             data = shortages_agg)

summary(model1)

shortages_agg$time_index <- as.numeric(shortages_agg$WeekStartDate)

model2 <- lm(shortage ~ 
               demand +
               intransit +
               vendor_po +
               fill_rate +
               customers +
               ProductDivision +
               time_index,
             data = shortages_agg)
summary(model2)

shortages_agg2 <- shortages_agg %>%
  arrange(ProductDivision, WeekStartDate) %>%
  group_by(ProductDivision) %>%
  mutate(
    lag_demand = lag(demand, 1)
  ) %>%
  ungroup()

model3 <- lm(shortage ~ 
               lag_demand +
               intransit +
               vendor_po +
               fill_rate +
               ProductDivision,
             data = shortages_agg2)
summary(model3)

AIC(model1, model2)
AIC(model3, model2)
library(Metrics)

rmse1 <- rmse(shortages_agg$shortage, predict(model1))
rmse1
rmse2 <- rmse(shortages_agg$shortage, predict(model2))
rmse2
rmse3 <- rmse(shortages_agg2$shortage, predict(model3))
rmse3

# I'm going to go with model 2
# It has the lowest RMSE and a lower AIC than model 1
summary(model2)
# Rsqured is kind of low though only 60%
# What is causing shortages:
## 1:
# Vendor PO stock
# So when vendor purchase orders increase, shortages increase
# But what could be causing vendor purchase order increases??
## 2:
# Product Division - Vascular Access
# This division has dramatically higher shortages than others
## 3:
# Time
# Shortages are decreasing overtime
## Summary
# Our model explains about 60% of shortage variation. 
# The most significant drivers are product category and vendor purchase orders. 
# In particular, the Vascular Access division experiences substantially higher shortages than others. 
# Interestingly, demand itself was not a significant predictor, suggesting shortages may be driven more by supply chain inefficiencies than demand spikes. 
# Additionally, shortages have been decreasing over time, indicating potential improvements in operations.

# Trying it with lags
shortages_agg <- shortages_agg %>%
  arrange(ProductDivision, WeekStartDate) %>%
  group_by(ProductDivision) %>%
  mutate(
    lag_shortage = lag(shortage, 1),
    lag_demand   = lag(demand, 1),
    lag_intransit = lag(intransit, 1)
  ) %>%
  ungroup()

shortages_agg <- shortages_agg %>%
  filter(!is.na(lag_shortage))

shortages_agg$log_shortage <- log1p(shortages_agg$shortage)

model4 <- lm(log_shortage ~ 
               lag_shortage +
               lag_demand +
               lag_intransit +
               vendor_po +
               fill_rate +
               customers +
               ProductDivision +
               time_index,
             data = shortages_agg)

summary(model4)
# This model has a much higher adjusted rsquared, about 73%
## 1:
# Lagged shortage
# If shortages were high last wee, they are likely high this week
# So shortages are persistent and problems don't resolve immediately
# Supply chain issues carry over week to week
## 2:
# Lagged in-transit stock
# More incoming stock last week results in fewer shortages this week
# Supply pipeline is working (with delay)
## 3:
# Lagged demand
# Borderline significant
# Higher demand last week slightly increases shortages
## 4:
# Vendor PO
# Borderline significant
# Ordering more stock is associated with higher shortages
## 5:
# Fill rate
# Super significant
# Higher fill rate is associated with higher logged shortage
# It's likely that fill rate and shortage are measuring similar system stress
## 6:
# Product division effects
# Super significant for Vascular Access in the fact that it results in high shortages
# Lower shortages result from: Orthopedics, Microtek, DME, SPT and supply chain optimization
## 7:
# Time trend
# Shortages are slightly increasing over time

# After incorporating lag effects and a log transformation, the model improved significantly, explaining about 73% of the variation in shortages. 
# The strongest predictor was prior shortages, indicating persistence in supply chain disruptions. 
# Additionally, higher in-transit inventory from the previous period significantly reduced current shortages, highlighting the importance of timely supply flow. 
# Demand also showed a delayed effect, suggesting that spikes in demand lead to shortages in subsequent weeks rather than immediately. 
# Product category remained a key driver, with certain divisions such as Vascular Access experiencing consistently higher shortages. 
# Finally, shortages appear to be slightly increasing over time after accounting for these dynamics.

## Predictions
library(prophet)
library(forecast)

ts_data <- shortages_agg %>%
  group_by(WeekStartDate) %>%
  summarise(shortage = mean(shortage, na.rm = TRUE)) %>%
  arrange(WeekStartDate)
head(ts_data)

# Prophet Model
prophet_data <- ts_data %>%
  mutate(y = log1p(shortage)) |>
  rename(ds = WeekStartDate) |>
  select(ds, y)

prophet_model <- prophet(
  prophet_data,
  changepoint_prior_scale = 0.3,
  weekly.seasonality = TRUE
)

## Create future (2026 — weekly, NOT daily)
future <- make_future_dataframe(
  prophet_model,
  periods = 52,
  freq = "week"
)

## Predict
forecast <- predict(prophet_model, future)
prophet_fitted <- predict(prophet_model, prophet_data)$yhat
ts_data$prophet_fitted <- exp(prophet_fitted)

## Convert back from log
forecast <- forecast %>%
  mutate(
    yhat_actual = expm1(yhat),
    yhat_lower_actual = expm1(yhat_lower),
    yhat_upper_actual = expm1(yhat_upper)
  )

library(prophet)
library(dplyr)
library(ggplot2)

## Create time series
ts_data <- shortages_agg %>%
  group_by(WeekStartDate) %>%
  summarise(shortage = mean(shortage, na.rm = TRUE)) %>%
  arrange(WeekStartDate)

# Prophet format
prophet_data <- ts_data %>%
  mutate(y = log1p(shortage)) %>%
  rename(ds = WeekStartDate) %>%
  select(ds, y)

## Fit model (less smooth)
prophet_model <- prophet(
  prophet_data,
  changepoint.prior.scale = 0.3,
  weekly.seasonality = TRUE
)

## Create future (2026 — weekly, NOT daily)
future <- make_future_dataframe(
  prophet_model,
  periods = 52,
  freq = "week"
)

## Predict
forecast <- predict(prophet_model, future)

## Convert back from log
forecast <- forecast %>%
  mutate(
    yhat_actual = expm1(yhat),
    yhat_lower_actual = expm1(yhat_lower),
    yhat_upper_actual = expm1(yhat_upper)
  )

## Keep only 2026 predictions
forecast_2026 <- forecast %>%
  filter(ds > max(ts_data$WeekStartDate))

## Plot (NOT a smooth line)
ggplot() +
  geom_line(data = ts_data,
            aes(x = WeekStartDate, y = shortage),
            color = "black") +
  geom_point(data = forecast_2026,
             aes(x = ds, y = yhat_actual),
             color = "seagreen", size = 2) +
  geom_ribbon(data = forecast_2026,
              aes(x = ds, ymin = yhat_lower_actual, ymax = yhat_upper_actual),
              alpha = 0.2, fill = "seagreen") +
  labs(title = "2026 Shortage Forecast (Prophet)",
       x = "Date",
       y = "Shortage")

# Looks like shortages are predicted to go down over the next year


