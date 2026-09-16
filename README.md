# MP2 Financial Planner

### A data-driven financial planning and simulation platform for Pag-IBIG MP2 savings

**MP2 Financial Planner** is an interactive web application designed to help Filipino savers understand, project, and plan their Pag-IBIG Modified Pag-IBIG II (MP2) savings.

The platform combines financial projection, historical dividend analysis, inflation-adjusted purchasing power, contribution planning, scenario analysis, sensitivity testing, and Monte Carlo simulation into a single planning environment.

> **Educational tool only.** Projections are estimates based on user-defined assumptions and historical data. They are not guarantees of future MP2 dividend rates or investment returns.

---

## Overview

Saving through MP2 is relatively straightforward, but understanding how contribution timing, dividend assumptions, inflation, compounding, and different savings strategies affect long-term outcomes can be difficult.

This project addresses that problem by turning MP2 planning into an interactive quantitative analysis workflow.

Instead of presenting a single projected balance, the application allows users to explore:

* How much their savings could grow over time
* How different contribution patterns affect projected dividends
* The effect of reinvesting dividends versus receiving annual payouts
* How inflation changes the purchasing power of future savings
* How historical MP2 dividend rates compare across years
* How sensitive projected outcomes are to dividend-rate assumptions
* How thousands of simulated scenarios can produce a range of possible outcomes
* How different savings strategies can be structured toward a financial goal

---

## Key Features

### Core MP2 Calculator

Build a personalized MP2 projection using:

* Initial savings
* Monthly contributions
* Projection period
* Assumed dividend rate
* Inflation assumptions
* Dividend treatment
* Contribution strategy

The calculator produces both **monthly and annual projections**.

The calculation engine incorporates a month-weighted dividend approach based on the application's implementation of Pag-IBIG's **Average Monthly Balance (AMB)** methodology.

---

### Contribution Planning

Users can model several contribution strategies:

* Fixed monthly contributions
* Increasing annual contributions
* Custom monthly contributions
* Annual lump-sum contributions
* Monthly contributions plus lump sums

This allows users to compare different saving behaviors rather than relying on a single fixed monthly contribution.

---

### Savings Goal Planner

Work backward from a target amount.

The Goal Planner estimates:

* Required monthly contribution
* Estimated total contributions
* Estimated dividends
* Projected maturity value
* Affordable contribution scenarios
* Potential shortfall or surplus

This transforms the calculator from a passive projection tool into a goal-oriented planning system.

---

### MP2 Ladder

The MP2 Ladder feature allows users to conceptualize multiple overlapping five-year MP2 cycles.

Instead of viewing MP2 as a single account, users can model multiple accounts with different:

* Start dates
* Initial deposits
* Monthly contributions
* Assumed dividend rates
* Maturity dates
* Dividend treatment

This provides a framework for analyzing recurring savings cycles and maturity schedules.

---

### Historical Dividend Analysis

The application includes historical MP2 dividend-rate data and associated inflation information.

Historical records include:

* MP2 dividend rate
* Regular Pag-IBIG savings rate
* Philippine inflation rate
* Dividend declaration status
* Source information
* Publication/report references
* Verification dates
* Declaration dates

The data layer is designed to distinguish between **declared historical rates** and rates that have not yet been declared.

---

### Inflation & Purchasing Power

Nominal savings growth does not necessarily represent equivalent growth in purchasing power.

The application therefore estimates:

* Future nominal value
* Inflation-adjusted real value
* Purchasing-power adjustment
* Purchasing-power reduction percentage
* Year-by-year inflation effects

This helps users interpret projected balances in terms of **today's purchasing power**, rather than only looking at nominal pesos.

---

### Sensitivity Analysis

The Sensitivity Matrix evaluates how projected maturity values change under different assumptions.

Users can examine how outcomes respond to changes in variables such as:

* Dividend rates
* Contribution levels
* Projection periods

This provides a simple way to understand model sensitivity and uncertainty.

---

### Monte Carlo Simulation

The Advanced Mode includes a Monte Carlo simulation engine that generates thousands of possible projection paths.

The application supports simulation outputs including:

* Mean outcome
* Median outcome
* 5th percentile
* 25th percentile
* 75th percentile
* 95th percentile
* Minimum outcome
* Maximum outcome
* Probability of reaching a financial goal
* Distribution of simulated outcomes

The current interface supports **5,000 simulation paths**.

The simulation engine uses historical dividend-rate characteristics to model uncertainty rather than presenting a single deterministic projection as if it were certain.

---

### What-If Scenario Analysis

Users can modify assumptions and immediately examine how their projected outcome changes.

Example questions include:

> What if I increase my monthly savings?

> What if dividends are lower than expected?

> What if I contribute a larger amount earlier?

> What if I reinvest my dividends?

> What happens to my purchasing power after inflation?

---

### Year-by-Year Analysis

Each projection can be broken down into annual records containing:

* Beginning balance
* Annual contributions
* Cumulative contributions
* Dividend rate
* Dividend earned
* Cumulative dividends
* Reinvested dividends
* Annual payout
* Ending balance
* Inflation rate
* Inflation-adjusted value
* Effective yield

The application also maintains month-level records for more granular analysis.

---

### Money-Weighted Return

The calculation engine includes a genuine **money-weighted return calculation** using an XIRR-style approach.

Monthly cash flows are incorporated into a Newton-Raphson numerical solution to estimate an annualized money-weighted rate of return.

This is useful when contributions occur at different points in time because the timing of cash flows affects the investor's realized return.

---

### Saved Scenarios

Users can save and revisit different financial scenarios.

Saved scenarios can preserve:

* Scenario title
* Creation date
* Calculation inputs
* Notes
* Contribution assumptions
* Dividend assumptions
* Projection period

This makes it possible to maintain multiple plans and compare different saving strategies.

---

### Shareable Plans

The application can encode core projection parameters into a shareable URL.

This allows a configured scenario to be shared or revisited without manually entering every parameter again.

---

### Export / Print Support

The application includes browser-based print functionality so users can generate a printable version of their planning results.

---

### Financial Literacy Tools

The platform includes educational sections explaining:

* MP2 fundamentals
* How MP2 works
* Contribution timing
* Dividend mechanics
* Inflation
* Planning strategies
* Methodology
* Assumptions
* Sources and legal basis

The goal is to make quantitative financial analysis understandable to users who may not have a technical finance background.

---

## Simple Mode & Advanced Mode

The application separates the experience into two levels.

### Simple Mode

Designed for users who want a straightforward projection.

Users can focus on:

* Savings amount
* Monthly contribution
* Time horizon
* Dividend assumptions
* Projected maturity value

### Advanced Mode

Designed for deeper financial and quantitative analysis.

It exposes tools such as:

* Historical rate analysis
* Sensitivity analysis
* Monte Carlo simulation
* Inflation analysis
* Alternative comparisons
* Scenario analysis
* MP2 ladder planning
* Detailed methodology and sources

---

## Calculation Methodology

The application's primary projection engine operates on a month-by-month basis.

For each projection year, the model considers:

1. Beginning account balance
2. Monthly contributions
3. Contribution timing
4. Applicable dividend-rate assumption
5. Monthly contribution weighting
6. Annual dividend accumulation
7. Dividend treatment
8. Inflation adjustment

The implementation uses the following month-weighting concept for contributions:

```text
Contribution Dividend
= Monthly Remittance × ((13 - Month Number) / 12) × Dividend Rate
```

The yearly dividend is then composed of:

```text
Annual Dividend
= Beginning Balance Dividend
+ Month-Weighted Contribution Dividends
```

For reinvestment:

```text
Ending Balance
= Contributions + Reinvested Dividends
```

For annual payout:

```text
Ending Account Balance
= Contributions

Annual Dividend
= Paid Out Separately
```

The application also calculates inflation-adjusted purchasing power using a compounded inflation deflator:

```text
Real Value
= Future Nominal Value / Cumulative Inflation Factor
```

---

## Rate Assumption Modes

The application supports multiple approaches for projecting future dividend rates:

| Mode                 | Description                                                |
| -------------------- | ---------------------------------------------------------- |
| `latest_declared`    | Uses the latest declared rate available to the application |
| `historical_average` | Uses an average derived from historical rates              |
| `conservative`       | Uses a more conservative rate assumption                   |
| `custom`             | Allows the user to define a custom projection rate         |

The model also supports custom annual dividend-rate overrides.

This prevents the application from treating an assumed future dividend rate as an officially declared rate.

---

## Project Structure

```text
mp2-financial-planner/
│
├── src/
│   ├── components/
│   │   ├── CoreCalculator.tsx
│   │   ├── DashboardView.tsx
│   │   ├── GoalPlanner.tsx
│   │   ├── ContributionPlanner.tsx
│   │   ├── Mp2Ladder.tsx
│   │   ├── MonteCarloSimulation.tsx
│   │   ├── SensitivityMatrix.tsx
│   │   ├── InflationAnalysis.tsx
│   │   ├── HistoricalTracker.tsx
│   │   ├── ScenarioPlanner.tsx
│   │   ├── CompareAlternatives.tsx
│   │   ├── YearByYearTable.tsx
│   │   ├── InteractiveGrowthChart.tsx
│   │   ├── ResultsDashboard.tsx
│   │   ├── Sidebar.tsx
│   │   └── ...
│   │
│   ├── data/
│   │   ├── historicalRates.ts
│   │   └── alternativesData.ts
│   │
│   ├── lib/
│   │   ├── mp2Calculator.ts
│   │   ├── rateResolver.ts
│   │   └── ...
│   │
│   ├── types/
│   │   └── mp2.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── index.html
├── server.ts
├── vite.config.ts
├── package.json
├── tsconfig.json
└── .env.example
```

---

## Technology Stack

### Frontend

* **React 19**
* **TypeScript**
* **Vite**
* **Tailwind CSS**
* **Lucide React**
* **Motion**

### Backend / Runtime

* **Node.js**
* **Express**
* **tsx**
* **esbuild**

---

## Example Projection

A sample scenario can be configured with:

```text
Starting Amount:       ₱10,000
Monthly Contribution:  ₱5,000
Annual Increase:       5%
Projection Period:     5 years
Assumed Dividend:      7.12%
Dividend Treatment:    Reinvest
Inflation Assumption:  3.00%
```

The application then calculates the projected monthly and annual accumulation based on the selected assumptions.

**Important:** The resulting value is a model output, not a guaranteed future MP2 balance.

---

## Data Integrity & Assumptions

The project distinguishes between:

* Historical declared rates
* Projected rates
* User-defined assumptions
* Historical inflation
* Projected inflation

Where applicable, historical records contain source metadata such as:

* Source title
* Source URL
* Report/publication
* Page reference
* Verification date
* Declaration date

Future dividend rates should not be interpreted as official Pag-IBIG declarations until formally announced by Pag-IBIG Fund.

---

## Design Philosophy

The project follows three principles:

### 1. Transparency

Financial projections should expose their assumptions instead of hiding them behind a single output number.

### 2. Scenario Thinking

A financial plan should be evaluated under multiple possible conditions rather than assuming one guaranteed future.

### 3. Financial Literacy

Quantitative tools should help users understand the mechanics behind their results, not simply provide a number.

---

## Use Cases

MP2 Financial Planner can be used for:

* Personal savings planning
* Financial literacy
* Classroom demonstrations
* Economics and finance projects
* Scenario analysis
* Savings-goal planning
* Inflation analysis
* Quantitative financial modeling
* Research and educational demonstrations

It can also serve as a prototype framework for broader personal-finance planning applications.

---

## Limitations

The model is subject to several limitations:

* Future MP2 dividend rates are uncertain.
* Historical dividend performance does not guarantee future performance.
* Inflation assumptions are estimates.
* Monte Carlo simulations are model-dependent and do not represent guaranteed probability distributions.
* Alternative investment comparisons may use illustrative assumptions.
* Actual Pag-IBIG account rules, crediting procedures, eligibility requirements, and product terms should always be verified against official Pag-IBIG documentation.
* The application is an educational planning tool and does not constitute personalized financial advice.

---

## Roadmap

Potential future improvements include:

* [ ] Automated official-rate data updates
* [ ] More granular historical datasets
* [ ] Improved stochastic models
* [ ] Portfolio-level savings analysis
* [ ] More comprehensive tax and fee modeling
* [ ] Enhanced scenario comparison
* [ ] PDF report generation
* [ ] User authentication and cloud synchronization
* [ ] Mobile-first optimization
* [ ] Expanded Philippine financial-product datasets
* [ ] API-based economic indicators
* [ ] Automated data validation pipelines

---

## Why This Project?

MP2 Financial Planner was developed around a simple question:

> **How can quantitative financial modeling make everyday savings decisions easier to understand?**

Rather than treating savings as a static calculation, this project approaches MP2 planning as a small financial modeling system.

It combines:

**Financial Mathematics + Economics + Data Analysis + Simulation + Financial Literacy**

to provide a more complete view of how saving behavior, dividend assumptions, contribution timing, and inflation interact over time.

---

## Disclaimer

This application is intended for **educational, informational, and financial-planning simulation purposes only**.

Projected values are estimates generated from assumptions selected by the user or embedded in the model. They should not be interpreted as guaranteed MP2 returns, official Pag-IBIG projections, investment recommendations, or personalized financial advice.

Users should verify current MP2 terms, dividend declarations, eligibility requirements, and other official information directly with **Pag-IBIG Fund** before making financial decisions.

---

## Author

**Jeferson P. Besitulo**

Economics | Econometrics | Data Analysis | Financial Modeling

Developed as a quantitative financial-planning project combining economic analysis, financial mathematics, data visualization, and interactive web application development.

---

## License

This project is currently provided for educational and research purposes.

Add an appropriate open-source license to the repository if you intend to permit redistribution, modification, or commercial use.
