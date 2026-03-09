# Subnet Gas Station

**Unified Gas Payment Layer for Avalanche Subnets**

Subnet Gas Station enables users to interact with Avalanche Subnets using a single asset (e.g., USDC), eliminating the need to hold subnet-native gas tokens.

Instead of requiring users to acquire subnet gas tokens before interacting with applications, Subnet Gas Station introduces an intent-based execution layer that handles gas payments via relayers.

---

# Problem

Within the Avalanche ecosystem, each Subnet can define its own native gas token.

While this design enables flexibility and customization, it introduces significant onboarding friction.

Users who want to interact with a Subnet must first:

1. Bridge assets to the target network
2. Swap for the subnet’s native gas token
3. Wait for confirmation
4. Execute their first transaction

This process creates unnecessary complexity and discourages exploration of new Subnet applications.

---

# Solution

Subnet Gas Station introduces a **cross-subnet gas abstraction layer**.

Users sign a transaction intent using a single asset (e.g., USDC on C-Chain). A relayer then executes the transaction on the target Subnet and pays the required gas.

The system removes the need for users to manage multiple gas tokens across the ecosystem.

---

# Demo Overview

This repository demonstrates a working prototype of Subnet Gas Station with an **Application Portal interface**.

The portal currently supports a single Subnet application:

**Dexalot DEX**

Users can execute trades on the Dexalot Subnet without holding its gas token.

---

# Demo Flow

### Step 1 — Connect Wallet

User connects their wallet to the portal.

Example wallet state:

```
USDC: 100
ALOT: 0
AVAX: 0
```

The user does not hold the Dexalot Subnet gas token.

---

### Step 2 — Select Application

The portal displays available Subnet applications.

Currently supported:

```
Dexalot (DEX)
```

Future integrations may include:

```
GameFi
NFT Marketplaces
DeFi protocols
```

---

### Step 3 — Sign Intent

User initiates a trade action.

Example:

```
Swap
USDC → ALOT
Amount: 10
```

The user signs an **Intent**, not a traditional transaction.

---

### Step 4 — Cross-Subnet Execution

Once the intent is submitted:

1. Assets are locked on C-Chain
2. A cross-subnet message is sent via Avalanche Teleporter
3. A relayer receives the intent
4. The relayer pays gas on the Dexalot Subnet
5. The transaction is executed on Dexalot

---

### Step 5 — Result

The trade completes successfully.

Example output:

```
Received: ALOT
Gas paid by Subnet Gas Station
```

The user was able to interact with the Dexalot Subnet without holding its gas token.

---

# Architecture

```
User
 │
 │ Sign Intent
 ▼
C-Chain Contract
 │
 │ Lock user assets
 ▼
Teleporter Cross-Chain Message
 │
 ▼
Relayer Network
 │
 │ Pays subnet gas
 ▼
Dexalot Subnet
 │
 ▼
Execute Trade
```

---

# Components

### Intent Contract (C-Chain)

Responsible for:

* Receiving user intents
* Locking assets
* Emitting cross-chain messages

---

### Teleporter Messaging Layer

Cross-subnet communication is powered by Avalanche’s native messaging protocol.

Ensures:

* secure message delivery
* subnet verification

---

### Relayer Network

Relayers listen for intents and execute transactions on target Subnets.

Responsibilities:

* pay subnet gas
* execute application calls
* finalize transaction

---

### Application Portal

Frontend interface providing a unified entry point to Subnet applications.

Current integration:

```
Dexalot
```

Future integrations:

```
GameFi
NFT
DeFi
```

---

# Supported Application (Demo)

### Dexalot

Dexalot is a Subnet-based decentralized exchange with a central limit order book model.

Demo trade example:

```
USDC → ALOT
```

Users can acquire subnet-native assets without holding the subnet gas token.

---

# User Experience Comparison

Traditional Subnet Interaction

```
Bridge assets
↓
Acquire subnet gas token
↓
Execute first transaction
```

Subnet Gas Station

```
Sign intent
↓
Relayer pays gas
↓
Transaction executed
```

---

# Key Features

Unified gas payment across Subnets

Intent-based transaction execution

Cross-subnet interoperability

Application portal interface

Reduced onboarding friction

---

# Future Roadmap

Support multiple Subnet applications

Integrate GameFi Subnets

Enable NFT minting across Subnets

Add dynamic gas pricing

Expand relayer network

---

# Tech Stack

Frontend

```
Next.js
Tailwind
ethers.js
```

Smart Contracts

```
Solidity
Avalanche C-Chain
```

Infrastructure

```
Avalanche Teleporter
Relayer Network
```

---

# Project Vision

Subnet Gas Station aims to become the **universal gas abstraction layer for Avalanche Subnets**, enabling seamless interaction across the ecosystem with a single asset.

By removing gas token friction, we enable users to explore Subnet applications without worrying about network-specific tokens.

---

# License

MIT
