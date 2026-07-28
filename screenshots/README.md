# MyKitchen Screenshot Plan

This directory contains the screenshots used to present MyKitchen in the public README, portfolio, resume materials, and personal website.

## Required Screenshots

| File | Content | Suggested viewport |
|---|---|---|
| `dashboard-desktop.png` | Dashboard summary cards and recent inventory | 1440 × 900 |
| `inventory-desktop.png` | Inventory grid with realistic sample items | 1440 × 900 |
| `item-form-desktop.png` | Add-item form with representative values | 1440 × 900 |
| `inventory-mobile.png` | Mobile inventory layout | 390 × 844 |

## Preparation

Before capturing screenshots:

1. Use the deployed application.
2. Sign in with a demonstration account.
3. Add realistic but non-sensitive sample inventory.
4. Include items from the fridge, freezer, and pantry.
5. Include fresh, expiring, expired, opened, and undated items.
6. Close developer tools and browser notifications.
7. Use the default browser zoom level.
8. Avoid displaying personal email addresses or account details.

## Suggested Sample Inventory

Possible items include:

- Milk
- Eggs
- Spinach
- Chicken thighs
- Frozen blueberries
- Brown rice
- Tomato soup
- Peanut butter
- Coffee
- Leftover pasta

Use ordinary or fictional data only.

## Desktop Captures

Use a browser viewport near:

```text
1440 × 900
```

Capture:

- The dashboard with meaningful summary data
- The inventory page with several cards visible
- The add-item form with representative values entered

## Mobile Capture

In Firefox, open Responsive Design Mode:

```text
Ctrl + Shift + M
```

Set the viewport to:

```text
390 × 844
```

Capture the inventory page with:

- The mobile header
- The Add Item button
- Search and filter controls
- At least one complete inventory card

## Visual Review

Before keeping a screenshot, confirm:

- Text is readable
- No loading indicators are visible
- No errors or warnings are visible
- Cards and controls are aligned
- Long item names do not overflow
- The active navigation item is clear
- No credentials, tokens, private emails, or database information appear

## README Integration

After adding the screenshots, reference them from the main README with relative paths:

```markdown
![MyKitchen dashboard](screenshots/dashboard-desktop.png)

![MyKitchen inventory](screenshots/inventory-desktop.png)

![MyKitchen item form](screenshots/item-form-desktop.png)

![MyKitchen mobile inventory](screenshots/inventory-mobile.png)
```
