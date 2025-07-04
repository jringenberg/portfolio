---
title: papr Loans
description: By Joe Ringenberg
---
*papr* is a novel mechanism for decentralized lending, and Backed's second protocol targeting the space.

The Backed team comprised a designer (myself) and three engineers.

*"papr" is pronounced "paper"* and stands for "Perpetual APR". This name hints that APR is perpetually changing based on the market, and also provides a fun and fitting visual language of dot-matrix printing and graph paper.

![Each papr token has its own bright graph-paper theme that serves as a contextual affordance for users interacting with similar pages across different subdomains.](/content/writing/zWJ2N30sEDhh2Z35Iqi5-1.png)

### How it works

It's a complicated protocol in a complicated space!

The interface and interactions are full of tricky challenges, but the biggest challenge of all is explaining how it works. Once you "get it" it's very exciting, but the learning curve for complex protocols at the intersection of DeFi and NFTs is quite steep. Here's the best ELI5 illustration:

![](/content/writing/zWJ2N30sEDhh2Z35Iqi5-2.png)

Like all things crypto, the rabbit holes lead to more rabbit holes, so coming up with a simple metaphor with an intuitive value proposition (balance = good) gives users on both sides of the market a simple place to begin.

Borrowers are willing to pay interest in order to get loans. Lenders are willing to give loans in order to earn interest. The fairest interest rate happens when the demand from both of those parties is balanced.

papr makes this possible by building the lending mechanism out of a token that trades freely on Uniswap.

![](/content/writing/zWJ2N30sEDhh2Z35Iqi5-3.png)

* "High borrower demand" happens when Borrowers create more loans, minting and selling papr tokens, and pushing down the price of papr tokens.

* When Borrowers close their loans, they rebuy papr tokens — the amount the tokens have gone up in price is the equivalent of an interest charge that they must pay.

* "High lender demand" happens when Lenders see papr tokens rise in value (due to the inflation that happens when Borrowers repay loans plus interest) and choose to buy and hold papr tokens. This purchase

Because these buy/sell actions take place in a Uniswap pool, they transmit "perfect information" to the market. The ETH/papr swap price can be thought of as an oracle for exactly what interest rate reflects market sentiment.

![](/content/writing/zWJ2N30sEDhh2Z35Iqi5-4.png)

Throughout the development of the protocol, my design work was focused on clarifying the concept through copywriting and these diagrams. As its function became more clear, the design work shifted into ultralight prototypes on testnet and then to the frontend that was launched for mainnet in early 2023.

### Design Details

One particularly helpful design choice made at the onset of UI work on was to use the classic-HTML `<fieldset>` element (think: Craigslist) to organize the UI. Because the work was so experimental, we often had to build a rudimentary interface in order to understand the constraints and opportunities. These nicely-labeled sandboxes (that's the `<legend>` element) kept our UI organized as it evolved, and the constraint of a fixed width forced us to be concise and avoid anything that wouldn't translate well to a mobile screen.

![](/content/writing/zWJ2N30sEDhh2Z35Iqi5-5.png)

One of my favorite elements is that "Impact Projection" diagram that is made with ASCII art. This hyper-simplification helps keep the focus on the relationship between the values represented. This goal of simplification is perfectly met with the vintage-office-printer aesthetic I chose for papr.

Here's an early exploration for the aesthetic, which went harder on looking like a bank statement you might receive in 1996.

![](/content/writing/zWJ2N30sEDhh2Z35Iqi5-6.png)

### Transaction Buttons

Another element particularly well-suited for the task at hand is the transaction buttons. A common need in crypto is to approve an asset for use before a user is able to use it to complete a transaction. Each of those steps needs to be completed onchain, which means a button click is not an instant action, but a series of states. These buttons report their status and even link to proof on etherscan once the transaction is successful.

![](/content/writing/zWJ2N30sEDhh2Z35Iqi5-7.png)

### Beyond Interface

Another unique factor in designing a crypto protocol is that its core functionality is live on the blockchain and can be used with no interface at all. So while the front-end client the team built was how we most often imagined users interacting with the protocol, it was important to imagine and design for other contexts. In this tweet, I imagined how the core functionality of papr loans would look if it were incorporated in the Uniswap interface and design system.

This turned out to be a fantastic exercise in paring down complexity!

### Project Retrospective

The novel protocol design began as a mad-scientist experiment — the market mechanism made sense on paper but we didn't know if it would actually *work* in real life. The experiment proved a success! Interest rates rose and fell as Borrowers and Lenders expressed their demand.

Unfortunately, the demand the expressed for NFT-backed loans from both parties was pretty small. As of 2023, the protocol had facilitated about $150k of loans, which isn't enough to justify development by a full-time team.

While the protocol continues eternally on the Ethereum blockchain, Backed decided to wind down operations, including hosting the front-end client documented in these designs.