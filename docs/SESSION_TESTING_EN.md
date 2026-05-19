# Session Testing Guide

Features implemented in this session:
- **BK-04** Tracklist on album detail page
- **BK-10** Special Offers section on catalog page
- **BK-08** Shipping form with validation and checkout breadcrumb
- **BK-06** On-chain ETH payment page via MetaMask
- **BK-11** MusicBrainz enrichment script + Vinyl specs on album detail

---

## Prerequisites

```bash
# 1. Start MongoDB
docker start ud2a-mongo

# 2. Start backend
npm --prefix server start

# 3. Start frontend (separate terminal)
npm --prefix client run dev
```

Open **http://localhost:5173** in a browser with MetaMask installed.

> **Payment setup:** before testing BK-06, open `client/src/config/payment.js`
> and set `STORE_WALLET` to a valid Ethereum address (e.g. your own MetaMask wallet).

---

## 1. Special Offers section — BK-10

- [ ] Open http://localhost:5173
- [ ] Verify a **Special Offers** section appears between the hero banner and the main catalog grid
- [ ] Verify it shows **2 cards**: Dark Side of the Moon and Rumours (both marked featured)
- [ ] Verify each card has an orange **Featured** badge in the top-right corner
- [ ] Click **View** on any Special Offers card → verify navigation to the correct album detail page

---

## 2. Tracklist — BK-04

- [ ] Open the **Dark Side of the Moon** detail page
- [ ] Verify a **Tracklist** section appears below the album info
- [ ] Verify it shows **9 tracks**, starting with *Speak to Me / Breathe (3:57)*
- [ ] Verify track durations appear in orange on the right

- [ ] Open the **Abbey Road** detail page
- [ ] Verify **17 tracks**, last one is *Her Majesty (0:23)*

- [ ] Open the **Rumours** detail page
- [ ] Verify **10 tracks**, starting with *Second Hand News (2:43)*

---

## 3. Vinyl Specs — BK-11

- [ ] Open the **Dark Side of the Moon** detail page
- [ ] Verify a **Vinyl specs** block appears below the Add to Cart button
- [ ] Verify it shows:
  - Format: `12" Vinyl`
  - Label: `Pink Floyd Records`
  - Country: `XE`
  - Barcode: `5099902987613`

- [ ] Open the **Abbey Road** detail page
- [ ] Verify:
  - Label: `Apple Records`
  - Country: `US`
  - Barcode: `094638246817`

- [ ] Open the **Rumours** detail page
- [ ] Verify:
  - Label: `Warner Bros. Records`
  - Country: `GB`
  - No barcode row (not available for original 1977 pressing)

---

## 4. Shipping Form — BK-08

- [ ] Add any album to the cart (via catalog or album detail page)
- [ ] Navigate to **/cart**
- [ ] Verify a **Proceed to Checkout →** button appears at the bottom
- [ ] Click it → verify redirect to **/checkout/shipping**
- [ ] Verify checkout breadcrumb shows: **Cart › Shipping › Payment** with Shipping highlighted

**Validation:**
- [ ] Click **Continue to payment →** without filling anything → verify all 5 fields show a *Required* error
- [ ] Fill in one field, submit again → verify only the remaining empty fields still show errors

**Happy path:**
- [ ] Fill in all fields (any test data)
- [ ] Click **Continue to payment →** → verify redirect to **/checkout/payment**

**Persistence:**
- [ ] Navigate back to **/checkout/shipping**
- [ ] Verify the form is **pre-filled** with the data you entered (saved to localStorage)

**Back navigation:**
- [ ] Click **← Back to cart** → verify it returns to the cart page

---

## 5. Payment Page — BK-06

### Setup check
- [ ] Navigate directly to **/checkout/payment** without setting `STORE_WALLET`
  → verify an error message appears: *"Payment is not configured..."*
- [ ] Set a valid address in `client/src/config/payment.js`, restart the dev server

### Order summary
- [ ] With items in cart and shipping filled, open **/checkout/payment**
- [ ] Verify **Order summary** lists each cart item with quantity and ETH subtotal
- [ ] Verify **Total** matches the cart total
- [ ] Verify **Ship to** block shows the name and address from the shipping form
- [ ] Click **Edit** → verify it navigates back to the shipping form

### MetaMask flow — rejection
- [ ] Click **Pay now** → verify MetaMask opens
- [ ] **Reject** the transaction in MetaMask
- [ ] Verify the error *"Transaction rejected."* appears on the page
- [ ] Verify the **Pay now** button is available again for retry

### MetaMask flow — success
- [ ] Click **Pay now** again → verify button changes to *"Waiting for MetaMask..."*
- [ ] **Confirm** the transaction in MetaMask
- [ ] Verify the success screen appears: *"Order placed!"*
- [ ] Verify a **transaction hash** is displayed
- [ ] Verify the **cart is now empty** (check header or navigate to /cart)
- [ ] Click **Back to catalog** → verify navigation to the catalog page

### Edge cases
- [ ] Navigate to **/checkout/payment** with an **empty cart** → verify the empty cart message appears instead of the payment form

---

## 6. MusicBrainz Enrichment Script — BK-11

- [ ] Stop the backend if running
- [ ] Run: `npm --prefix server run enrich`
- [ ] Verify the output shows all 3 albums found and saved without errors
- [ ] Verify the script completes in ~15 seconds (6 requests with 1.2 s pauses)
- [ ] Start the backend again and verify Vinyl specs still appear on album detail pages
