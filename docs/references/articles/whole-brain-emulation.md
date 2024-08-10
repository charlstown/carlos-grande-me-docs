---
short_title: Whole brain emulation
description: none
date: 2019-01-01
thumbnail: /assets/images/resources/data-mesh-portrait.png
---

# Whole brain emulation

![Robot](https://carlosgrande.me/wp-content/uploads/2021/01/ba1e4da68a8260760c07e20617db0893-186x300.jpg)



I wanted to post some conclusions from a recent book I've been reading. **The Technological Singularity** (Shanahan, M. 2015). A singularity in human society would occur if the exponential technological progress brought such a dramatic change that human affairs as we understand them today came to an end. In this case, the *whole brain emulation theory* could make a singularity in our human society.

---

## The whole brain emulation theory
The idea behind the *whole brain emulation theory (WBE)* is to make an exact working copy of a particular brain in a nonbiological system. To achieve this idea, we need to assume the hypothesis that human behavior is determined exclusively by physical processes in the brain that mediate between its incoming sensory signals and its outgoing motor signals.

### The three stages behind the "WBE" theory
Shanahan says that there are three stages to achieve the whole brain emulation **mapping, simulation, and embodiment**.

[caption id="attachment_1738" align="aligncenter" width="413"]<a href="https://carlosgrande.me/wp-content/uploads/2021/01/SuccesLevelsWBE.jpg"><img src="https://carlosgrande.me/wp-content/uploads/2021/01/SuccesLevelsWBE.jpg" alt="Success levels for WBE." width="413" height="610" class="size-full wp-image-1738" /></a> Success levels for WBE.<br />Sandberg, A. and Bostrom, N. (2008), "Whole Brain Emulation: A Roadmap".[/caption]


**The first stage is to map the brain of the subject at high spatial resolution**. The result will be an exquisitely detailed blueprint of a particular brain at a particular time.

**The second stage of the process is to use this mapped blueprint to build a real-time simulation emulating the electrochemical activity** of all those neurons and their connections. This simulation could be built using the standard techniques from the field of computational neuroscience, using mathematical formulations of neural behavior such as the [Hodgkin-Huxley model](https://en.wikipedia.org/wiki/Hodgkin%E2%80%93Huxley_model#:~:text=The%20Hodgkin%E2%80%93Huxley%20model%2C%20or,as%20neurons%20and%20cardiac%20myocytes. "Hodgkin-Huxley model").

**The third stage of the process is to interface the simulation to an external environment**, expecting incoming signals and generating outgoing signals just like those of its biological precursor.

If the mapping and simulation stages are successful, then the behavior of the simulated neurons, both individually and as a population, should be indistinguishable from that of the original, biological brain given the same input from the environment. Consequently, small inaccuracies in the mapping process, would cause the behavior of the simulation eventually to diverge from that of its biological prototype. If these microscopic deviations are sufficiently small, the macro-scale outward behavior of the emulation would surely be indistinguishable from that of the original. From the standpoint of an observer, **the emulation would seem to make the same decisions and perform the same actions as its prototype** under any given set of circumstances.

### The technology of Neural simulation
The electrical and chemical properties of the various components of a neuron can be modeled using Hodgkin-Huxley equations, and fortunately, neurons are slow. **Even when a neuron is excited it only emits a spike every few milliseconds**. In the time it takes for a typical neuron to emit two spikes, **a desktop computer running at a modest 3GHz can perform more than ten million operations**.

However, **even the brain of a mouse contains tens of millions of neurons**, and to simulate them all accurately and in real-time requires an awful lot of computation. Rather than using a serial processor that carries out one operation at a time, the simulation can be done with multiple processors all running simultaneously, each one simulating many thousands of neurons. And the neuron itself "computes" a function that continuously maps its dendritic "input" and the current state of its "memory" to the "output" signal it delivers to its axon.

As the number of processors they incorporate has increased, the cost per processor has gone down, following an exponential trend that accords with Moore's law. By 2012 the world's most powerful computer, Cray's Titan, was based on a hybrid architecture that incorporated 18 688 GPUs, each one in itself a powerful parallel computer.

### Brain scale computation
**It would be possible to simulate the whole brain of a mouse using the most powerful computers of the mid-2010s** if the level of physical detail required for successful emulation were sufficiently low and we had a blueprint at the required level of detail.

**The engineering challenge** here is not merely to achieve the required number of FLOPS (floating-point operations per second) but **to do so in a small volume and with low power consumption.** The **average human brain (female) occupies a mere 1 130 cm3 and consumes just 20 W**. By contrast, the Tianhe-2, the world's most powerful supercomputer in 2013, consumes 24M MW and is housed in a complex occupying 720 m2.

One promising approach is using [neuromorphic hardware](http://https://en.wikipedia.org/wiki/Neuromorphic_engineering "neuromorphic hardware"). Conventional digital hardware. performs hundreds of binary floating-point arithmetic operations to simulate a few milliseconds of change on a single neuron's membrane potential. This involves thousands of transistors switching events, each of which consumes power. The neuromorphic approach does away with all this digital paraphernalia and uses analog components that behave like the original neuron. The result is far more efficient in terms of power consumption.

What we need is hardware, one candidate is **quantum-dot cellular automata (QDCA)** nano-scale semiconductor device that can act like a transistor, witching states very rapidly but using very little power. The advantage of WDCA over conventional CMOS silicon technology is the enormous scale of integration of the permit, enabling many more switching devices to be placed in the same area.

---

**REFERENCES:**

- Shanahan, M. (2015). The Technological Singularity. (The MIT Press, Cambridge, Massachusetts)
- Sandberg, A. and Bostrom, N. (2008), "Whole Brain Emulation: A Roadmap".


**FURTHER READING:**

- About Hodgkin Huxley model: [Hodgkin–Huxley model](https://en.wikipedia.org/wiki/Hodgkin%E2%80%93Huxley_model#:~:text=The%20Hodgkin%E2%80%93Huxley%20model%2C%20or,as%20neurons%20and%20cardiac%20myocytes.)
- About [Whole-brain functional imaging at cellular resolution using light-sheet microscopy](https://www.nature.com/articles/nmeth.2434)
- About [Whole Brain Emulation Roadmap](https://www.fhi.ox.ac.uk/brain-emulation-roadmap-report.pdf)
- About [Sequencing the Connectome](https://journals.plos.org/plosbiology/article?id=10.1371/journal.pbio.1001411)
- About [ An Ultrasonic, Low Power Solution
for Chronic Brain-Machine Interfaces](https://arxiv.org/pdf/1307.2196.pdf)
- About the [Human Brain Project](https://www.humanbrainproject.eu/en/)
- About [Neuromorphic silicon neuron circuits](https://www.frontiersin.org/articles/10.3389/fnins.2011.00073/full)
- About [Molecular Quantum-Dot Cellular Automata](https://www3.nd.edu/~lent/pdf/nd/Molecular_Quantum-Dot_Cellular_Automata.pdf)
- About [Ultimate physical limits to computation](https://cds.cern.ch/record/396654/files/9908043.pdf)
- About [Neuromorphic engineering](https://en.wikipedia.org/wiki/Neuromorphic_engineering)
- More post like this here: [https://carlosgrande.me/category/articles/](https://carlosgrande.me/category/articles/)