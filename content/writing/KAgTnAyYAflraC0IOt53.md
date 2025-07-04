---
title: Creating An NFT Loan
description: By Joe Ringenberg
---
The first protocol developed by Backed facilitates peer-to-peer lending, using an NFT as collateral for a loan.

### Context: NFT Loans

A prospective Borrower sets the loan terms they'll accept and deposits their NFT, which is then visible to potential Lenders. If Lenders like the terms, they finance the loan and have the opportunity to seize the collateral if the loan and its interest isn't paid upon maturity. Lenders are also able to 'buy out' active loans by proposing better terms (such as a lower interest rate). In this event, the initial Lender is repaid and awarded any accrued interest, and the loan begins again at the new terms with the new Lender as counter-party.

![](/content/writing/KAgTnAyYAflraC0IOt53-1.png)

The details of loan offers (both for new loans and active loans) is presented as cards on the homepage. These details show the key terms of an NFT-backed loan: the collateral NFT, the amount borrowed, the interest rate, and the duration.

![](/content/writing/KAgTnAyYAflraC0IOt53-2.png)

### Creating a Loan

The biggest design challenge of this project was simplifying the loan-creation flow that a potential Borrower encounters. This flow involves different actions, critical decisions, and multiple onchain transactions. To mitigate that complexity, the design presents the work as a single, simple task flow. The goal is to build a sense of clarity and trust for the Borrower, to increase the number who are able to complete the task and deposit their NFT into the protocol.

![](/content/writing/KAgTnAyYAflraC0IOt53-3.png)

The first step of the design process was breaking the workflow down into discrete steps. The most important constraint at this stage was to complete the loan creation process on one screen, so that users are able to begin with the end in sight and complete the task as a series of small, safe, and clear steps.

Even before connecting their wallet, a user can see the entirety of the work ahead of them:

![](/content/writing/KAgTnAyYAflraC0IOt53-4.png)
![](/content/writing/KAgTnAyYAflraC0IOt53-5.png)
![](/content/writing/KAgTnAyYAflraC0IOt53-6.png)
![](/content/writing/KAgTnAyYAflraC0IOt53-7.png)
![](/content/writing/KAgTnAyYAflraC0IOt53-8.png)

A critical piece of feedback uncovered in testing early prototypes of the flow was that users needed clear descriptions of each step. Rather than rely on tooltips (which are rarely recognized and opened even when they're needed), I decided that if the form itself was presented in a single column, a persistent 'help bubble' could follow the user through the flow and explain each step.

This detail tested well and had the added benefit that, post-launch as the team heard feedback from real users, it was easy to adjust and add to the copy in each bubble.

### Transaction Buttons

Another principle guiding the design is to treat on-chain transactions as flows in and of themselves, using the button element as progress indicator both across the whole form and within each on-chain step. This "button" is wearing many hats, but its ability to span that complexity is what allows the form as a whole to appear simple despite its technical complexity.

![](/content/writing/KAgTnAyYAflraC0IOt53-9.png)

A subtle detail in these buttons is to leverage the tried-and-true HTML spec for clickable links (blue) and links-that-have-been-clicked (purple). While it's an aesthetic decision as much as anything, these colors offer a slight affordance to users. In contrast, the typical color-codings of green/red for go/stop or success/failure are so overloaded as to often make them *more* confusing for any semantic significance they carry.

![](/content/writing/KAgTnAyYAflraC0IOt53-10.png)

To some degree, all clicks that trigger an on-chain transaction feel like *risky* *clicks*. In the case of creating a loan, it's critical to communicate exactly what will happen the the loan is created and the Borrower mints the ticket that acts as a receipt. This is the reason one of the final steps of the flow is a simple "Review" toggle that shows the user a summary of the transaction they're about to execute.

Finally, when the Borrower creates the loan and "Mints Borrower Ticket," they receive an NFT that represents their position, as does a Lender when they choose to finance a loan.

![](/content/writing/KAgTnAyYAflraC0IOt53-11.png)

This NFT uses on-chain SVG art that I created as part of this project. The benefits of the art being entirely on-chain are many:

* Because the art itself is stored on the blockchain, it can be rendered eternally and updated based on transaction data

* **Loan Status** and **Interest Accrued** can be calculated and displayed in real time, in fact the interest math in this NFT is the source of record and determines the actual interest that is paid when a loan is closed

* The rights and obligations of Borrower and Lender are transferrable — whatever address holds the ticket is the de facto Borrower or Lender

* Finally (and purely aesthetically) the colors in the background gradient can be derived from the assets used in the loan (for example, all loans for WETH have the same light blue as one component of their gradient)

![](/content/writing/KAgTnAyYAflraC0IOt53-12.png)

### Project Retrospective

This project was the first lending protocol created by Backed, a team that consisted of myself (design) and three engineers. While the loan creation flow and other details of withbacked.xyz were effective and modestly successful (nearly $100k in loans facilitated) the team used the learnings from this version to launch a second, entirely new protocol at papr.xyz, which you can [read about here](https://read.cv/ringenberg/zWJ2N30sEDhh2Z35Iqi5).