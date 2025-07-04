---
title: DuneAI Design Details
description: By Joe Ringenberg
---
**What a fun time to be a designer!** AI is powering new tools, new capabilities for creators, and new territory for software design. The tech is so transformational that the design patterns and norms we've settled on in the past won't necessarily work for this new generation of tools. And without shared mental models and predictable interactions, users can end up frustrated and confused.

**So what's a designer to do?** How will we discover the "best practices" of human/AI interactions? I believe we can speed up the process by thinking out loud and working out in the open. If we share the rationale behind our design choices our judgements become richer, our opinions become more nuanced, and we can start to see themes and common threads that link successful moments.

### Context

DuneAI is a tool for querying blockchain data. In the past, Dune users had to write complex queries to build charts and dashboards of onchain data. But now anyone can describe the data they want to see and DuneAI will write the query as SQL code, run it, evaluate the results, and return them. This process isn't always quick but it's incredibly powerful!

![](/content/writing/ai-design-1.png)

DuneAI launched in the fall of 2023 and represents the work of an incredibly talented technical team on which I served as designer. These design notes cover some of the important details and the thinking behind them. They aren't prescriptive and will change as the team continues to build and explore this space, but I hope they serve as an invitation to discussion.

### Detail: Call to action

We've all clicked the most classic button-text a thousand times: *Add to cart. Sign up. Log in. Search.* But the button copy that initiates an AI prompt is new territory. We lack the vocabulary to describe what these tools do — in some sense it is highly technical. In another sense it is pure magic.

Here's DuneAI's main prompt input as it loads, how it looks after a prompt has been entered, and how it looks while the prompt is running:

![](/content/writing/ai-design-2.gif)

The primary input of DuneAI asks, "What do you want to know?" It gives the user a role to play and puts them on the spot. The technology powering the prompt is inscrutable, as would be a button with a technically-accurate CTA like "Execute prompt." Instead the button says "Find out," focusing on the value that the tool hopes to deliver.

If there's a single industry standard evolving in this space, it's the use of ✨ as an icon to evoke the magic of AI. These particular sparkles use the geometry popularized by OpenAI and add a little extra dash of magic by glittering while the tool is working.

### Detail: Token highlighting

The single variable with the biggest impact on the performance of DuneAI is a well-written prompt. But this is a new language for users! Having some example prompts is an easy way to steer users towards effective syntax and sufficient detail.

As users, we don't intuitively know what will work best or what's irrelevant. For example, asking politely doesn't make much of a difference to DuneAI. But accurately named blockchains, specific tables, exact addresses and project names have a huge impact on the output. The tool identifies these different tokens in the prompt and categorizes them as it searches for applicable data sets. So the examples highlight these important words with different colors for different token types.

![](/content/writing/ai-design-3.png)

It's unlikely that users will deduce the system or categories represented. But the goal of this visual detail is to draw attention to technical specificity, model clarity, and help users write prompts that are a little bit better. The header on the page uses this highlighting as a visual conceit as well. Again, it's unlikely that it will operate on a literal level. But a prompt that's a little bit better can lead to a result that's a lot better!

### Detail: Work in progress!

Some AI tools operate like chatbots, replying immediately. DuneAI operates more like Midjourney, working through an entire creation flow that can take a long time — sometimes seconds, sometimes minutes. By describing the work as it happens, the interface tries to build trust and patience. It's a reminder that behind the magic is some very heavy lifting.

![](/content/writing/ai-design-4.gif)

Animated, rolling ellipses communicate that work is still happening, even if the tool sits on a step for a long time with no sign of progress. Showing the elapsed time acknowledges that waiting, as if the tool is saying "I'm paying attention to how long this is taking!" And, "I know that your time is valuable." And, "Hold on a sec, I'm still cooking."

### Detail: Positive Reinforcement

Even after all that waiting, it's not guaranteed that the query DuneAI has written will return the result the user had in mind. Search results that disappoint are not new territory for users, but what's totally unprecedented is a tool's ability to learn from your feedback! Every new prompt that DuneAI is part of its training set, and the reinforcement training it receives from human feedback makes the model better the more its used.

![](/content/writing/ai-design-5.gif)

First and foremost, this element communicates that a result was successfully returned (that's why it's green!). Using 👍 and 👎 emoji makes the barrier to leaving feedback as low as possible, and is honest about the (low) level of sophistication of the signal. The accuracy score communicates that DuneAI is self-evaluating and frames the feedback as fundamentally about accuracy: "Was this the query you were hoping to run?" rather than "Does this particular data mean good news for you?"

### Detail: Big Picture

Tools with new capabilities can't rely on established patterns. The more AI tools we experiment with (and design!) the more expectations we'll have about how they behave. But until that time, it pays to be as explicit as possible. So DuneAI introduces itself at the top of the page with a simple value proposition:

![](/content/writing/ai-design-6.png)

As in the example prompts, the key words are styled as highlighted tokens. The literal connection to prompt engineering is even more tenuous here in the context of marketing copy! But the title sets the tone for the tool. Amid all the other elements and design details, what matters most are words.

While Dune's interface is set in IBM Plex (Sans and Mono), this text is set if IBM Plex Serif, as if it's being elevated to a headline. Written text as the technological innovation upstream of all this AI magic. If there's a single takeway or first-principle for AI design here it's this: *words matter.*