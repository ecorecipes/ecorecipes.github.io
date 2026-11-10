/*
 * The ecorecipes catalogue.
 *
 * This file is the single source of truth for the site. To add a package,
 * append an entry to PACKAGES; to add a family, append to FAMILIES.
 *
 *   name    repository name under github.com/ecorecipes
 *   family  id of an entry in FAMILIES
 *   role    id of an entry in ROLES
 *   blurb   one or two sentences, written for someone choosing a package
 *   docs    true if https://ecorecipes.github.io/<name>/ is live
 *   lang    "Julia" (default), or another language
 *   pkg     Julia package name, if it differs from the repository name
 *   tags    extra search keywords (not displayed)
 */
window.ECORECIPES = {
  org: "ecorecipes",

  ROLES: [
    { id: "method", label: "Method", hint: "Core modeling packages: start here" },
    { id: "data", label: "Data & I/O", hint: "Fitting from data and reading file formats" },
    { id: "zoo", label: "Model zoo", hint: "Collections of published, runnable models" },
    { id: "application", label: "Application", hint: "A specific system or published study" },
    { id: "categorical", label: "Categorical layer", hint: "Composition via applied category theory" },
    { id: "foundation", label: "Foundation", hint: "Shared types and numerics the others build on" },
  ],

  FAMILIES: [
    {
      id: "population",
      title: "Structured population dynamics",
      short: "Populations",
      blurb:
        "Matrix, integral and generator models of populations structured by stage, age or size, from fitting vital rates in field data through to weather-driven crop–pest systems. The four core backends share one set of abstractions, so the same analysis runs across them.",
      chooser: {
        caption: "Which backend? Pick by how state and time are represented.",
        cols: ["Discrete time", "Continuous time"],
        rows: [
          { label: "Discrete stages", cells: ["MatrixProjectionModels.jl", "FiniteStatePopulationDynamics.jl"] },
          { label: "Continuous trait", cells: ["IntegralProjectionModels.jl", "ContinuousStatePopulationDynamics.jl"] },
          { label: "Individuals", span: "IndividualBasedPopulationDynamics.jl" },
        ],
      },
    },
    {
      id: "bayes",
      title: "Bayesian networks & decision analysis",
      short: "Bayesian networks",
      blurb:
        "Belief networks, influence diagrams and causal loop diagrams for reasoning and deciding under uncertainty. Build a network, run exact or approximate inference, add decisions and utilities, and exchange models with Netica, GeNIe and HUGIN.",
    },
    {
      id: "ca",
      title: "Cellular automata",
      short: "Cellular automata",
      blurb:
        "Write a spatial model once and run it on arrays, GPUs, sparse event-driven grids or agent frameworks. A zoo of published ecological automata covers plant disease, pests and coastal dunes.",
    },
    {
      id: "abm",
      title: "Agent-based models",
      short: "Agent-based",
      blurb:
        "Run NetLogo models headlessly from Julia, or study classic agent-based models rewritten on a fast entity-component-system.",
      seeAlso: ["IndividualBasedPopulationDynamics.jl"],
    },
    {
      id: "stats",
      title: "Statistical modeling",
      short: "Statistics",
      blurb:
        "Flexible regression and semi-mechanistic fitting: smooths where the functional form is unknown, mechanism where it is not.",
      seeAlso: ["VitalRateModels.jl"],
    },
    {
      id: "cases",
      title: "Model ports & case studies",
      short: "Case studies",
      blurb:
        "Published models of specific systems: Julia ports validated against the originals, and modernized reference code for ash dieback (Python) and the cassava PBDM (Pascal).",
      seeAlso: ["PhysiologicallyBasedDemographicModels.jl"],
    },
  ],

  PACKAGES: [
    /* ---------- Structured population dynamics ---------- */
    {
      name: "MatrixProjectionModels.jl",
      family: "population",
      role: "method",
      docs: true,
      blurb:
        "Matrix projection models (MPMs) for stage- and age-structured populations: growth rate, stable structure, reproductive value, sensitivity and elasticity.",
      tags: "mpm leslie lefkovitch lambda discrete stage age",
    },
    {
      name: "IntegralProjectionModels.jl",
      family: "population",
      role: "method",
      docs: true,
      blurb:
        "Integral projection models (IPMs) for populations structured by a continuous trait such as size, built from survival, growth and fecundity kernels.",
      tags: "ipm kernel size continuous trait",
    },
    {
      name: "FiniteStatePopulationDynamics.jl",
      family: "population",
      role: "method",
      docs: false,
      blurb:
        "Discrete stages in continuous time: generator-matrix dynamics with maturation delays and events, lowered to ODEs and DDEs for the SciML solvers.",
      tags: "generator q-matrix ode dde delay sciml continuous time",
    },
    {
      name: "ContinuousStatePopulationDynamics.jl",
      family: "population",
      role: "method",
      docs: false,
      blurb:
        "Continuous traits in continuous time: integro-differential generators, delay terms and physiologically structured (PSPM) transport equations.",
      tags: "pspm transport pde ode dde sciml advection",
    },
    {
      name: "IndividualBasedPopulationDynamics.jl",
      family: "population",
      role: "method",
      docs: true,
      blurb:
        "Individual-based realizations of the same structured models on the Ark.jl entity-component-system, capturing demographic stochasticity and small-population effects.",
      tags: "ibm abm agent ark ecs stochastic super-individuals",
    },
    {
      name: "VitalRateModels.jl",
      family: "population",
      role: "data",
      docs: true,
      blurb:
        "Fit survival, growth, fecundity and recruitment from longitudinal field data, compare candidates by AIC/BIC, and turn the fits into MPM, IPM or PBDM inputs.",
      tags: "vital rates demography regression model selection aic",
    },
    {
      name: "PhysiologicallyBasedDemographicModels.jl",
      family: "population",
      role: "application",
      docs: true,
      blurb:
        "Physiologically based demographic models (PBDMs): weather-driven, stage-structured models of plants, arthropods and their interactions, reproducing published studies end to end.",
      tags: "pbdm gutierrez ponti weather temperature crop pest tritrophic distributed delay",
    },
    {
      name: "CategoricalPopulationDynamics.jl",
      family: "population",
      role: "categorical",
      docs: true,
      blurb:
        "Projection nets, Kan extensions, stratification and wiring-diagram composition for structured population models, built on Catlab.",
      tags: "catlab acset functor compose stratify coarsen",
    },
    {
      name: "ProjectionModels.jl",
      pkg: "StructuredPopulationCore.jl",
      family: "population",
      role: "foundation",
      docs: false,
      blurb:
        "Shared abstractions for the population packages: eigenanalysis, sensitivity and elasticity, time-lag structure and stochastic growth rates.",
      tags: "structuredpopulationcore eigen lambda core shared",
    },

    /* ---------- Bayesian networks & decision analysis ---------- */
    {
      name: "BayesianNetworks.jl",
      family: "bayes",
      role: "method",
      docs: true,
      blurb:
        "Build, validate and evaluate Bayesian networks, with interventions, composition and serialization. Networks are stored as attributed C-sets of mechanisms.",
      tags: "bbn belief network dag cpt intervention do-calculus",
    },
    {
      name: "BayesianNetworkInference.jl",
      family: "bayes",
      role: "method",
      docs: true,
      blurb:
        "Query a network: variable elimination, junction trees, belief propagation and exact fallbacks.",
      tags: "inference posterior junction tree belief propagation marginal",
    },
    {
      name: "InfluenceDiagrams.jl",
      family: "bayes",
      role: "method",
      docs: true,
      blurb:
        "Add decisions, information and utilities to a network: optimal policies, decision variable elimination and value of information.",
      tags: "decision analysis utility policy voi management",
    },
    {
      name: "CausalLoopDiagrams.jl",
      family: "bayes",
      role: "method",
      docs: true,
      blurb:
        "Causal loop diagrams as labelled graphs: link polarities, feedback loops, coarsening, and a bridge to and from Bayesian networks.",
      tags: "cld systems thinking feedback polarity sign",
    },
    {
      name: "BayesianNetworkFormats.jl",
      family: "bayes",
      role: "data",
      docs: true,
      blurb:
        "Read and write Netica, GeNIe, HUGIN, BIF, DSC and UAI files for Bayesian networks and influence diagrams.",
      tags: "netica genie hugin bif dsc uai xdsl import export",
    },
    {
      name: "EcologicalBayesianNetworks.jl",
      family: "bayes",
      role: "zoo",
      docs: true,
      blurb:
        "A zoo of ecological Bayesian belief networks and influence diagrams from the literature, with reference models and vignettes.",
      tags: "examples vignettes ecology management",
    },
    {
      name: "CategoricalBayesianNetworks.jl",
      family: "bayes",
      role: "categorical",
      docs: true,
      blurb:
        "Wiring diagrams and open Bayesian networks with compositional semantics, built on Catlab.",
      tags: "catlab open networks compose wiring",
    },
    {
      name: "CategoricalInfluenceDiagrams.jl",
      family: "bayes",
      role: "categorical",
      docs: true,
      blurb:
        "Open influence diagrams as structured cospans, with compositional expected-utility semantics.",
      tags: "catlab cospan compose decision",
    },
    {
      name: "MarkovCategories.jl",
      family: "bayes",
      role: "categorical",
      docs: true,
      blurb:
        "Markov categories as a GATlab theory, with finite stochastic kernels as a model.",
      tags: "gatlab category theory probability stochastic",
    },
    {
      name: "FiniteKernels.jl",
      family: "bayes",
      role: "foundation",
      docs: true,
      blurb:
        "Finite state spaces and stochastic kernels: the lightweight, Catlab-free numerical base of the Bayesian-network packages.",
      tags: "kernel stochastic matrix probability base",
    },

    /* ---------- Cellular automata ---------- */
    {
      name: "CellularAutomataCore.jl",
      family: "ca",
      role: "method",
      docs: true,
      blurb:
        "One model specification, pluggable backends: dense arrays, GPU arrays, sparse and event-driven grids, Agents.jl and Ark.jl.",
      tags: "grid lattice gpu sparse spatial backend",
    },
    {
      name: "EcologicalCellularAutomata.jl",
      family: "ca",
      role: "zoo",
      docs: true,
      blurb:
        "A zoo of published ecological cellular automata, from plant diseases and agricultural and forest pests to coastal dunes, each runnable on any compatible backend.",
      tags: "examples spatial spread disease pest dune landscape",
    },
    {
      name: "CategoricalCellularAutomata.jl",
      family: "ca",
      role: "categorical",
      docs: true,
      blurb:
        "Cellular automata over groups as a cartesian category, generalized automata over group homomorphisms, and wiring-diagram composition.",
      tags: "catlab group compose wiring category theory",
    },

    /* ---------- Agent-based models ---------- */
    {
      name: "NetLogo.jl",
      family: "abm",
      role: "method",
      docs: false,
      blurb:
        "A clean-room, headless-first Julia implementation of the NetLogo language and runtime: load and run .nlogo models, or write NetLogo inline with a string macro.",
      tags: "netlogo nlogo turtles patches interpreter compiler headless",
    },
    {
      name: "ArkModelZoo.jl",
      family: "abm",
      role: "zoo",
      docs: false,
      blurb:
        "Classic NetLogo models rewritten on the Ark.jl entity-component-system: Segregation, Wolf–Sheep Predation, Ants, Daisyworld, Virus and Ethnocentrism.",
      tags: "ark ecs schelling wolf sheep daisyworld examples",
    },

    /* ---------- Statistical modeling ---------- */
    {
      name: "GAM.jl",
      family: "stats",
      role: "method",
      docs: true,
      blurb:
        "Generalized additive models for Julia, ported from R's mgcv: 31 smooth bases, REML/GCV/NCV smoothness selection, GAMLSS, shape constraints, quantile and extreme-value models.",
      tags: "gam mgcv smooth spline regression gamlss scam qgam bam gamm reml",
    },
    {
      name: "PartiallySpecifiedModels.jl",
      family: "stats",
      role: "method",
      docs: false,
      blurb:
        "Fit dynamical models in which some functional responses are left unspecified and learned from data with penalized splines, Gaussian processes or neural networks.",
      tags: "psm ude semiparametric functional response spline neural sciml ode",
    },

    /* ---------- Model ports & case studies ---------- */
    {
      name: "Aeolis.jl",
      family: "cases",
      role: "application",
      docs: true,
      blurb:
        "A Julia port of AeoLiS, the process-based model of wind-blown sediment transport in coastal environments, with a SciML-style interface.",
      tags: "aeolian sediment dune coast wind sand",
    },
    {
      name: "AshDieback.jl",
      family: "cases",
      role: "application",
      docs: true,
      blurb:
        "A mechanistic-statistical model of the spread of ash dieback across France: a Julia port of PEOC.",
      tags: "hymenoscyphus fraxineus forest pathogen invasion spread tree disease",
    },
    {
      name: "peoc_py3",
      family: "cases",
      role: "application",
      docs: false,
      lang: "Python",
      blurb:
        "A Python 3 port of PEOC 1.0 (Fritsch et al.), the ash dieback model, giving bit-for-bit the same outputs as the Python 2 original, with an optional faster solver and a command-line runner.",
      tags: "peoc chalara ash dieback hymenoscyphus fraxineus python metropolis-hastings mcmc reference",
    },
    {
      name: "PowderyMildew.jl",
      family: "cases",
      role: "application",
      docs: true,
      blurb:
        "Seasonal, leaf-level and spatial models of oak powdery mildew (Erysiphe alphitoides).",
      tags: "oak fungus plant pathogen epidemic tree disease",
    },
    {
      name: "QTLSim.jl",
      family: "cases",
      role: "application",
      docs: true,
      blurb:
        "A Julia port of QTSim, the quantitative-genetics simulation of Pagel, Gardner & Meade (2025), validated against the original, with an optional categorical layer.",
      tags: "quantitative genetics qtl evolution trait simulation",
    },
    {
      name: "pascal-pbdm-cassava-fpc",
      family: "cases",
      role: "application",
      docs: false,
      lang: "Pascal",
      blurb:
        "The CASAS cassava tri-trophic PBDM (Gutierrez et al. 2025), modernized from legacy Delphi 3 to Free Pascal.",
      tags: "cassava casas free pascal delphi reference pbdm physiologically based demographic",
    },
    {
      name: "pascal-pbdm-cassava",
      family: "cases",
      role: "application",
      docs: false,
      lang: "Pascal",
      fork: true,
      blurb:
        "The original Pascal source of the cassava tri-trophic PBDM system, kept as a reference fork.",
      tags: "cassava casas pascal original pbdm physiologically based demographic",
    },
  ],

  /* Public repositories deliberately left out of the guide. Listing them here
     also keeps them out of the automatic "New on GitHub" section. */
  HIDDEN: ["stressmodel-paper"],

  /* "I want to..." entry points. Each links to one or more packages. */
  TASKS: [
    { want: "Project a stage- or age-structured population", use: ["MatrixProjectionModels.jl"] },
    { want: "Model a population structured by size or another continuous trait", use: ["IntegralProjectionModels.jl"] },
    { want: "Work in continuous time, with maturation delays", use: ["FiniteStatePopulationDynamics.jl", "ContinuousStatePopulationDynamics.jl"] },
    { want: "Simulate individuals and demographic stochasticity", use: ["IndividualBasedPopulationDynamics.jl"] },
    { want: "Estimate survival, growth and fecundity from field data", use: ["VitalRateModels.jl", "GAM.jl"] },
    { want: "Model weather-driven crop–pest–enemy systems", use: ["PhysiologicallyBasedDemographicModels.jl"] },
    { want: "Build and query a Bayesian belief network", use: ["BayesianNetworks.jl", "BayesianNetworkInference.jl"] },
    { want: "Open a Netica, GeNIe or HUGIN file", use: ["BayesianNetworkFormats.jl"] },
    { want: "Compare management options under uncertainty", use: ["InfluenceDiagrams.jl"] },
    { want: "Simulate spread across a landscape grid", use: ["CellularAutomataCore.jl", "EcologicalCellularAutomata.jl"] },
    { want: "Run an existing NetLogo model from Julia", use: ["NetLogo.jl"] },
    { want: "Fit smooth, nonlinear relationships", use: ["GAM.jl"] },
    { want: "Learn an unknown functional response from time series", use: ["PartiallySpecifiedModels.jl"] },
    { want: "Compose models from reusable parts", use: ["CategoricalPopulationDynamics.jl", "CategoricalBayesianNetworks.jl", "CategoricalCellularAutomata.jl"] },
    { want: "Start from a published, worked example", use: ["EcologicalBayesianNetworks.jl", "EcologicalCellularAutomata.jl", "ArkModelZoo.jl"] },
  ],
};
