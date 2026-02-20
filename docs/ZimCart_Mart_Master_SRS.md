# ZimCart Mart Operations: The Unified Master SRS
**Project**: ZimCart - Mart-Side Internal Operations
**Version**: 10.0.0 (The Production-Ready Final)
**Applicability**: Enterprise Grocery Ecosystems (Target: Imtiaz, Punjab Cash & Carry, Metro)

---

## 1. Executive Summary
This document serves as the **Single Source of Truth (SSoT)** for the ZimCart Mart Application. It defines a production-grade Warehouse & Order Management System tailored for high-volume grocery retail. The system focuses on four core pillars: **Operational Speed**, **Inventory Integrity**, **Secure Logistics**, and **Store Growth**.

---

## 2. Module 1: Enterprise Identity & Access Management (IAM)
### 2.1 Role Architecture (Dual-Role Model)
The system is optimized for two primary personas with strict permission boundaries:
*   **Merchant (Business Owner)**: Focused on financial health, branch-level setup, bulk listing, and manager oversight.
*   **Manager (Operational Lead)**: A "super-functional" role responsible for one-by-one listing, stock maintenance, picking, packing, and rider coordination.

### 2.2 Advanced Authentication Flow
*   **Security Stack**: Stateless JWT (Access Token) + Secure Refresh Token rotation.
*   **Multi-Factor Authentication (MFA)**: Mandatory OTP for high-stakes actions:
    *   *Merchant*: Requesting bank payouts or changing store legal metadata.
    *   *Manager*: Authorizing price overrides > 20% or significant order cancellations.

---

## 3. Module 2: The Infinite Catalog & Listing Engine
### 3.1 Hierarchical Category & Attribute Framework
A recursive category tree allows for enterprise-level organization:
*   **N-Level Categories**: e.g., `Grocery > Dairy > Milk > UHT Milk`.
*   **Category Logic**: Items inherit properties (e.g., "Meat" category requires a "Cold Storage" tag and "UoM: Weight").

### 3.2 Dynamic Product Listing
*   **Bulk Listing (Merchant)**: CSV/Excel ingestion for initial catalog setup (10k+ items).
*   **"One-by-One" Scan & Find (Manager)**:
    1.  Manager scans EAN-13/UPC barcode.
    2.  System queries the ZimCart Global Master DB.
    3.  If Match Found: Auto-fills Name, Category, Images. Manager only inputs **Price** and **Current Stock**.
    4.  If New Item: Manager inputs full metadata and uploads photos manually.
*   **Unit of Measure (UoM) Profiles**:
    *   **Discrete (Units)**: Bottles, packets, cans.
    *   **Fractional (Loose)**: Produce, meat, grains. Requires "Minimum Weight" and "Increment Step" (e.g., 500g steps).

### 3.3 Inventory Governance & Shrinkage
*   **Stock Buffering**: Reservation of items at "Add to Cart" to prevent race conditions during peak hours.
*   **Near-Expiry Engine**: Tracking expiry dates and auto-triggering "Flash Sale" discounts to minimize waste.
*   **Shrinkage & Waste Logging**: Manager-level manual inventory deductions for expired, damaged, or leaked items with reason codes.

---

## 4. Module 3: Fulfillment & The "Picking Factory"
### 4.1 Digital Picking Workflow
*   **Aisle-Optimized Sequence**: Picking lists are algorithmically re-ordered based on the store's aisle topology.
*   **Barcode Verification**: Mandatory scan for every item picked to ensure variant accuracy (Full Cream vs. Skimmed Milk).
*   **High-Volume Alerts**: Continuous, looping audio alarms for new orders to ensure zero missed opportunities in noisy environments.

### 4.2 Dynamic Substitution Manager (DSM)
*   **OOS Protocol**: When an item is flagged out-of-stock, the app suggests 3 AI-ranked alternatives.
*   **Interactive Substitution Session**: A 2-minute real-time approval window where the Manager and Customer sync on replacements.

### 4.3 Weighted Correction Unit
*   **The Weight Bridge**: For weighted items (e.g., 1.2kg Chicken instead of 1kg), the Manager enters actual weight.
*   **Automatic Adjustment**: System recalculates the final invoice and notifies the Customer of the price variance before final settlement.

---

## 5. Module 4: Fleet Logistics & Secure Handover
### 5.1 Rider Management
*   **Assignment Logic**: Smart assignment based on "Rider Proximity" and "Order Readiness".
*   **Rider Radar**: Geofenced alerts to Mart Staff: *"Rider is 300m away, move package to Handover Zone."*

### 5.2 Handover Security
*   **OTP/QR Protocol**: The Manager generates a code; Rider validates it. This atomsically transitions the order state to `PICKED_UP`.
*   **Quality Proof**: Mandatory photo upload of the sealed bag manifest before the Rider departs.

---

## 6. Module 5: Store Management & CRM
### 6.1 Compliance & Settings
*   **Operations Manager**: Configure store hours, manage holiday calendars, and toggle "Emergency Close" mode.
*   **Geofence Control**: Dashboard to view/verify the delivery radius mapped to the physical location.
*   **Document Vault**: Uploading and tracking legal compliance documents (Tax, Safety, Licenses).

### 6.2 Unified Communication (CRM)
*   **Multi-Role Chat**: A central hub for the Manager to chat with the Customer (for substitutions/directions) and the Rider (for pickup/parking).

---

## 7. Module 6: Financials, Promotions & BI
### 7.1 Smart Accounting
*   **Wallet Analytics**: Live tracking of Gross Sales, ZimCart Commission, and Net Payout balance.
*   **Tax Compliance**: Automated application of category-specific GST/VAT.

### 7.2 Growth Engine
*   **Store-Level Promotions**: Merchants can create custom coupons and "Buy One Get One" (BOGO) deals for specific dates.
*   **Product Boosting**: Ability to "Feature" specific SKUs at the top of the Customer search results for a set duration.

---

## 8. Operational State Machine
Every order ID must follow this atomic path:
1. `PLACED` → 2. `ACCEPTED` → 3. `PICKING` → 4. `SUBSTITUTION` (Optional) → 5. `WEIGHT_CORRECTED` (Optional) → 6. `PACKED` → 7. `ASSIGNED` → 8. `PICKED_UP` → 9. `OUT_FOR_DELIVERY` → 10. `COMPLETED`.

---

## 9. Edge Case Matrix
| Scenario | Recovery Protocol |
| :--- | :--- |
| **Barcode Conflict** | If two items share a UPC, system creates a `Mart-Unique SKU` to prevent data pollution. |
| **Weight Variance > 15%** | Triggers mandatory Customer Re-approval for the new price. |
| **Partial Order Acceptance** | If 5/10 items available, system calculates partial refund instantly during `PACKED` state. |
| **Connectivity Drop** | Local Picking Cache. Auto-syncs to cloud using background workers upon reconnection. |

---

## 10. Non-Functional Production Requirements
*   **Performance**: REST API updates < 400ms; Socket broadcast < 1.0s.
*   **Hardware Hooks**: Drivers for Bluetooth SC Scanners (HID) and ESC/POS Thermal Printers.
*   **High-Availability**: Robust handling of concurrent stock updates via pessimistic database locking.

---
