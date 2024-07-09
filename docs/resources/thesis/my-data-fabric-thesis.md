# My data fabric thesis { .text-center }

<div class='image-caption image-centered image-width-24' markdown>

- ![data-fabric](https://carlosgrande.me/wp-content/uploads/2022/07/DataFabric_MainTitle.png)
- My data fabric thesis
{ .caption }

</div>

After Posting my thesis about [Data Mesh](https://carlosgrande.me/my-data-mesh-thesis/), I realized Data fabric is often mistaken for Data Mesh. There is a lot of confusion between these two models, so I decided to do some research about the Data Fabric architectural approach.

The goal of this article is to try and bring some clarity to all concepts associated with a **Data Fabric**, including an end to end storytelling with a thesis structure. This is just my public personal attempt to make sense of all the information I have found about this matter.

---

## 1. Context
Current methods of managing data attempt to meet all the objectives using data warehouses and data lakes, but those legacy architectures cannot include all the data that is needed. Although, they remain important components in a larger distributed data landscape.

Data sharing isn’t too hard at a small scale but rapidly becomes challenging as variables like the number of independent projects, the variety of database technologies, variation of computing platforms, etc. increase. Satisfying these complex scenarios becomes prohibitively difficult and expensive to accomplish through independent bespoke processes.

In this context, Data Fabric emerges as a design concept that acts as an integrated layer (fabric) of data and connecting processes. It represents a single environment having a combination of architecture and technology designed to ease the complications of managing dynamic, distributed, and diverse data.


[caption id="attachment_2342" align="aligncenter" width="450"]<a href="https://carlosgrande.me/wp-content/uploads/2022/07/DataFabric_Example.png"><img src="https://carlosgrande.me/wp-content/uploads/2022/07/DataFabric_Example.png" alt="Data Fabric Layers" width="457" height="380" class="size-full wp-image-2342" /></a> Data Fabric Layers[/caption]


So what is a Data Fabric? Data fabric is an architectural approach and a set of technologies to break down data silos and get data into the hands of data users. if I would like to say what is a Data Fabric in a short definition, I would pick the following:

> **A Data Fabric is a metadata-driven unified platform that connects multiple technologies, deployment platforms, and automation services, with a single and consistent data management framework. It provides seamless data access and processing by design across siloed storage.**



[caption id="attachment_2343" align="aligncenter" width="1230"]<a href="https://carlosgrande.me/wp-content/uploads/2022/07/DataFabricSummary.png"><img src="https://carlosgrande.me/wp-content/uploads/2022/07/DataFabricSummary.png" alt="Data Fabric Comparison" width="1230" height="497" class="size-full wp-image-2343" /></a> Data Fabric Comparison[/caption]



## 2. Principles
Basically, data fabric is an architecture that improves data management by reducing data complexity and enabling agility. The effectiveness of data fabric approach, however depends on its abilities to meet numbers of principles. These principles that define data fabric can be divided into: data access, data storage, data management, and data expose.

[caption id="attachment_2363" align="aligncenter" width="1252"]<a href="https://carlosgrande.me/wp-content/uploads/2022/07/DataFabric_PrinciplesStrechSort.png"><img src="https://carlosgrande.me/wp-content/uploads/2022/07/DataFabric_PrinciplesStrechSort.png" alt="Data Fabric Principles" width="1252" height="869" class="size-full wp-image-2363" /></a> Data Fabric Principles[/caption]


### 2.1 Unified data access
Providing a single and seamless point of access to all data
regardless of structure, database technology, and deployment platform creates a cohesive analytics experience working across data storage silos.

- Data fabric needs to support **different data types** and **access protocols** to allow organizations to easily access data from everywhere, anywhere at any time.

- **Multitenancy** is essential in data fabric such that it gives organizations the ability to create logical separations for administration, access, update, and execution.
- Data fabric should provide **support for integrating data streaming** to easily integrate data in transit with data at rest.

### 2.2 Infrastructure resilience
Decoupling data management processes and practices from specific deployment technologies makes for a more resilient infrastructure. Whether adopting edge computing, GPU databases, or technology innovations not yet known, the data fabric’s management framework offers a degree of “future-proofing” that reduces the disruptions of new technologies. New infrastructure end-points are connected to the data fabric without impact to existing infrastructure and deployments.

Supports the full variety of data storage options, automatically applying the best mix of storage technologies depending on use cases.
- Data fabric should give **linear scalability** where fabric is not limited by the number of files, concurrent client access, and increase in data volumes.
- Data fabric is designed to ensure data **consistency** so that data is manageable across multiple environments regardless of its location. A layer built on top of many data sources. This layer presents information as a single virtual (or logical) view regardless of its type and model. It all happens on-demand and in real-time.
- **Distributed metadata** across all data storing nodes should be supported in the fabric to prevent bottlenecks.
- It is necessary for a data fabric to give **distributed location support** where it can be installed and deployed in any location (any environment) across the entire infrastructure.

### 2.3 Unified data management
Providing a single framework to manage data across
disparate deployments reduce the complexity of data management.

- Data fabric provides**Governance and privacy** ensuring the right users in our platform have access to the right data by using **active metadata**, to automate a lot of the enforcement of the policies we define (Mask datasets, RBAC, data lineage, and data quality).
- Data fabric helps us **define compliance policies** like GDPR, CCPA, HIPAA, FCRA, etc.
- Metadata management is another ubiquitous component with touch points throughout the data fabric. Metadata reduces friction throughout the processes of working with data. It is needed to search and understand data, assess data quality, prepare and provision data, protect and govern data, trace data lineage, and trust data and analysis results.

### 2.4 Consolidated data protection
Data security, backup, and disaster recovery methods are built into the data fabric framework. They are applied consistently across the infrastructure for all data whether deployed in cloud, multi-cloud, hybrid, or on premises.

A distinct security and protection component is needed to provide cohesion and continuity across all security and protection touch points. Smart data security interoperates with existing authentication and authorization infrastructure. Smart data protection guards against risks from intrusion, corruption, and loss by automating detection and tagging of sensitive data assets and by providing data recovery capabilities.

### 2.5 Cloud mobility and portability
Minimizing the technical differences that lead to cloud service lock-in and enabling quick migration from one cloud platform to another supports the goal of a true cloud-hybrid environment.

Data stored across multiple environments should not be isolated or siloed. Processing can’t be confined to a single execution environment when data resides on multiple platforms. With data fabric orchestration, a single control platform can execute a sequence of services, built with diverse technologies and distributed across multiple execution environments. When data is distributed across multiple platforms, it makes sense to push the processing to the data location. Smart data fabric automates the coordination of multi-services workflows across all execution environments for comprehensive cloud, multi-cloud, and cloud-hybrid support.



## 3. Data Fabric Architecture
A well designed data fabric architecture is modular and supports massive scale, distributed multi-cloud, onpremise, and hybrid deployment.



[caption id="attachment_2344" align="aligncenter" width="1155"]<a href="https://carlosgrande.me/wp-content/uploads/2022/07/DataFabric_Architecture.png"><img src="https://carlosgrande.me/wp-content/uploads/2022/07/DataFabric_Architecture.png" alt="Data Fabric Architecture" width="1155" height="889" class="size-full wp-image-2344" /></a> Data Fabric Architecture building blocks.[/caption]



### 3.1 Connection layer
In order **to provide data across “otherwise siloed storage” a connection layer governs access to data assets and metadata** through standard mechanisms whilst preserving (where possible) the native asset access APIs.  It provides interfaces and factories for named connectors that access distributed data resources. These data resources may be data stores (databases, files, etc.) or APIs for application data, transformations, and analytical functions.

- SQL and NoSQL databases like MySQL, Oracle, and MongoDB
- CRMs and ERPs
- Cloud data warehouses like Amazon Redshift or Google Big Query
- Data lakes and enterprise data warehouses
- Streaming sources like IoT and IoMT devices
- SaaS (Software-as-a-Service) applications like Salesforce
- Social media platforms and websites
- Spreadsheets and flat files like CSV, JSON, and XML
- Big data systems like Hadoop, and many more.

**The Connection Layer acts as a secure factory for connectors to data stores.**  The application supplies the name of the connection it needs and assuming it is authorized, the Connection layer returns the connector.

[caption id="attachment_2378" align="aligncenter" width="1175"]<a href="https://carlosgrande.me/wp-content/uploads/2022/07/DataFabric_DataConnectionLayer-1.png"><img src="https://carlosgrande.me/wp-content/uploads/2022/07/DataFabric_DataConnectionLayer-1.png" alt="Data Connection Layer" width="1175" height="662" class="size-full wp-image-2378" /></a> Data Connection Layer[/caption]


The main components of a Connection layer are:

- *Connection:* The connection is a metadata entity that defines the set of parameters needed to access a specific data resource.  Each connection has a unique name.  An application can request a connector instance from the OCF using the name of a connection.
- *Connector Broker:* A connector instance is an object that implements the Connector API.   It provides access to a data resource, along with its related metadata stored.  The connector instance is responsible for calling the governance action framework when it is initialized and before and after every access request to the data resource.
- *Connector Provider:* A connector provider is the factory for a particular type of connector.  The connection stored in the Metadata repository will identify the connector provider. The connector provider is responsible for the overall management of the physical data resources that is it using. It may therefore implement capabilities such as connector pooling and limit the number of active connectors to the data resource if appropriate.



### 3.2 Virtualization layer
In a nutshell, data virtualization happens via middleware that is nothing but a unified, virtual data access layer built on top of many data sources. This layer presents information as a single virtual (or logical) view regardless of its type and model. It all happens on-demand and in real-time.

[caption id="attachment_2369" align="aligncenter" width="1175"]<a href="https://carlosgrande.me/wp-content/uploads/2022/07/DataFabric_DataVirtualizationLayer.png"><img src="https://carlosgrande.me/wp-content/uploads/2022/07/DataFabric_DataVirtualizationLayer.png" alt="Data fabric virtualization layer" width="1175" height="738" class="size-full wp-image-2369" /></a> Data Fabric virtualization layer[/caption]



#### 3.2.1 Storage & Mapping
The layer where the virtual and the physical data resides. The virtual store only contains logical views and metadata needed to access the sources, during the physical store.
- *The SQL engine* is responsible for processing SQL queries in SAP HANA. The SQL Parser (part of SQL Engine) first checks the syntactic and semantic correctness of the SQL query. The SQL query is then parsed through the SQL optimizer to create an acyclic tree-structure of operations and estimated cost is assigned to each operation in the tree structure. Depending on the complexity involved, the SQL Optimizer may generate multiple execution plan and the most cost-effective execution plan will be forwarded to the SQL Executor.
The SQL executor will then forward the request to the appropriate engines i.e. Row store engines to deal with row tables and Column store engines (Calc. Engine, Join Engine and OLAP engine) for the column tables.
- *The calculation engine* is used to perform field level calculations and union/rank operations on the dataset, unfolding the definitions, meaning, origin, and rules of the information used by its metadata. There are three types of metadata:
	- *Business Metadata:* stores business-critical definitions of information
	- *Technical metadata:* stores data mapping and transformations from source systems to the target and is mostly used by data integration experts and ETL developers.
	- *Operational metadata:* describes information from operational systems and runtime environments.


#### 3.2.2 Virtual data models
It is a structured representation of the virtual and local data with consistent modeling rules applied and providing direct access.
- *Calculation views* fully support set based operations enabling real-time analytics and on the fly calculations without the use of persistent aggregates. Calculation views are un-folded to the table/database objects and any table/database objects not contributing to the SQL execution are eliminated to build a single acyclic data-flow graph for the SQL query.

### 3.3 Data access layer
A single point of access to data kept in the underlying sources. The delivery of abstracted data views happens through various protocols and connectors depending on the type of the consumer. They may communicate with the virtual layer via SQL and all sorts of APIs, including access standards like JDBC and ODBC, REST and SOAP APIs, and many others.

- *Data Catalog:* To provide a service which allows one to search for data and datasets across an enterprise. Sounds like a search index on data and metadata right? That’s the basis but the key is not to just return data records but help one find the topics in the data fabric that they came from.
- *Query services:* provides a user interface and a RESTful API from which you can create SQL queries to better analyze your data. With the user interface, you can write and execute queries, view previously executed queries, and access queries saved by users within your Organization. 
- *APIs:* offering an access to your business logic through an Interface (the API), with full control on what you want to show or not.
- *Data provisioning:* the process of making data available in an orderly and secure way to users, application developers, and applications that need it.

### 3.4 Data Governance
When consuming from a data fabric it can be very useful to understand some details about what you are getting. What is the quality? Where did it come from? What is its lineage? The necessity of data governance services is highly dependent on the organization building the data fabric.

Governance, data privacy, and data sovereignty must be aligned. Because data stored in binary or digital form is subject to the conditions of the country in which the data resides, it is imperative that organizations understand the nature of their cloud architecture and interactions. Moreover, it is important to understand the rules, legislation, and regulations that apply to various countries as they apply to personal information, data privacy, and data protection.

### 3.5 Data security & policies

The data fabric must accommodate governance and data privacy in a way that is appropriate for the service models (that is, IaaS, PaaS, SaaS) being provided. Security capabilities must be considered through every architectural layer of the data fabric. It is also imperative that organizations know how their data is being secured.

- *Secure Multitenancy (SMT):* Organizations must understand how their service providers segment and isolate each customer in their cloud infrastructure and how that manifests itself across a data fabric.
- *Data in Use, in Motion, and at Rest:* refers to any data being processed by a cloud service provider. It is key to maintaining security throughout the lifecycle because it is crucial to maintaining an organization’s security posture. The fact that cloud solutions rely on shared processes and resources introduces the requirement for more diligence. The security criteria that are maintained within an organization must be maintained and possibly enhanced across the data fabric.
- *Key Management:* refers to safeguarding and managing keys in order to manage a secure environment that effectively safeguards an organization’s data. A key aspect of the key management solution across a data fabric is maintaining proper access to the keys while securely storing them.



## 4. Market State & Use Cases

Data fabric is a relatively new concept and the technology market is best characterized as emerging and evolving. Today no single vendor provides a complete data fabric solution in a single product. Data fabric vendors fit into the following three main categories:
- *Single Product:* A few vendors offer a single product that provides much, but not all, data fabric functionality. These are good choices if they offer the functions that are most essential for your organization and have a strong roadmap for the future.
- *Single Vendor:* Some vendors offer multiple products, each providing a subset of data fabric functionality. They emphasize interoperability among the products as the approach to delivering some (again, not all) data fabric functionality. These may be good choices if the product suite provides the most needed functions, especially for those who already use some of their products.
- *Multiple Vendors:* Many vendors offer products that deliver a subset of data fabric functionality. These can be good choices for those organizations whose technology infrastructure includes diverse products that each provide some data fabric functionality, and who have the technical ability to resolve interoperability among disparate products.

In enterprise operations, there are scores of use cases that require a high-scale, high-speed data architecture capable of supporting thousands of simultaneous transactions. Examples include:

- *Delivering a 360 customer view:* delivering a single view of the customer to a selfservice IVR, customer service agents (CRM), customer self-service portal (web or mobile), chat service bots, and field-service technicians
- *Complying with data privacy laws:* with a flexible workflow and data automation solution that orchestrates compliance across people, systems, and data designed to address current and future regulations.
- *Pipelining enterprise data into data lakes and warehouses:* enabling data engineers to prepare and deliver fresh, trusted data from all sources, to all targets quickly and at scale.
- *Provisioning test data on demand:* creating a test data warehouse, and delivering anonymized test data to testers and CI/CD pipelines automatically, and in minutes with complete data integrity.
- *Modernizing legacy systems:* safely migrating data from legacy systems into data fabric, and then using the fabric as the database of record for newly developed applications.
- *Securing credit card transactions:* Protecting sensitive cardholder information by encrypting and tokenizing the original data to avoid
data breaches.
- Predicting churn, detecting customer, and others.



## 5. Data Fabric Implementation
As we have seen, data fabric is a high-level data architecture, and each company and provider offer it with different patterns and technologies. In this way, it is essential to remember that the Data Fabric is not static. It is a journey that iterates over the development of the platform, looking to abstract the silos of physical information into a logical layer of data.

### 5.1 AS-IS analysis
- **Identify your data sources:** decide what and how much data there is to be virtualized. For this purpose, make a comprehensive list of all datasets, applications, services, and systems producing information. Along with that, determine their locations, management demands, and connectivity requirements to enable them to easily communicate with the virtualization layer. Some systems lay on the surface as they are used in your day-to-day operations while others may be in the depths of IoT devices and social media sites. It is a good idea to include all sources that can enhance business analytics.
- **Identify your consumers:** Similar to the previous step, you may want to list all the tools and applications that will reside on the consumer side. Specify what connectors and protocols each of the consumers require for it to have access to the virtual views. Which of the operations in your company will benefit from the virtualization the most? Start with the tools supporting these operations.
- **Decide on resources and people involved:**  While it is easier and less costly to implement compared to traditional ETL, you will still have to determine your budget and available resources — both tech and human. Along with business analysts, you may need such specialists as data engineers and SQL developers to model data, build transformations, design data services, optimize queries, and manage resources.

### 5.2 Developing a technical reference model (TRM)
Data fabric can be implemented with multiple technologies and patterns. It is mandatory to  provide a reference of generic platform services, technology elements and patterns for each layer (connection, virtualization, and data access layers). The TRM provides a set of architectural and solution building blocks that will ultimately provide the platform for business and infrastructure applications that will deliver the application and infrastructure services. The Technical Reference Model ensures that architectures are created consistently and repeatedly based on a standard set of elements. The model should be created as part of the set up of the architecture programs but will typically require extending as technology standards are introduced and retired.

### 5.3 TRM implementation and Tech Stack
Once defined, the Technical Reference Model can be used as the basis for all Infrastructure Architecture models by creating instances of the Infrastructure elements. We also need to define/update our company tech stack (a tech stack typically consists of programming languages, frameworks, a database, front-end tools, back-end tools, and applications connected via APIs). For example, in the Connection layer, we could use Apache Atlas as a Connector directory providing a list of related connections.



## 6. Conclussion

A data fabric is not an off the shelf sort of thing. It is currently more of a design pattern for something that has been built in different ways across many different organizations. That being said, It’s also not something that needs to be built from scratch. There are many off the shelf components with a little integration work that will get you to the promised land.

---

## 7. Terminology

Data Fabric isn't a static architecture although it has some related terms. At the next table, I tried to extract the main vocabulary around this topic.

| Word | Definition |
|------|------------|
| **Data Fabric** | A metadata-driven unified platform that connects multiple technologies, deployment platforms, and automation services, with a single and consistent data management framework. It provides seamless data access and processing by design across siloed storage. |
| **Connection layer** | A layer to provide data across siloed storage, governing the access to data assets and metadata through standard mechanisms and acting as a secure factory for connectors to data stores. |
| **Virtualization layer** | A layer to present information as a single virtual (or logical) view on-demand and in real-time, regardless of its type and model. |
| **Data access layer** | A single point of access to data kept in the underlying sources. The delivery of abstracted data views happens through various protocols and connectors depending on the type of the consumer. |
| **Connector** | An object to provide access to a data resource, along with its related metadata stored. |
| **Metadata** | Metadata unfolds the definitions, meaning, origin, and rules of the information used in the platform. |
| **Virtual data model** | It is a structured representation of the virtual and local data with consistent modeling rules applied and providing direct access. |
| **Calculated View** | stores data mapping and transformations from source systems enabling real-time analytics and on the fly calculations without the use of persistent aggregates. |
| **Calculation engine** | An engine used to perform field level calculations and union/rank operations on the dataset. |
| **Data mapping** | A process to map the data path from the source system that contains different data fields from the target, appliying on the fly calculations. |



## 8. Discovery Roadmap
To elaborate this Thesis, I have been recollecting links and resources about the Data Fabric architecture. I wanted to share the discovery path I\'ve followed to understand the Data Fabric implications.

### 8.1 Introductory content

[What is a data fabric and why should you care?](https://www.idginsiderpro.com/article/3226393/what-is-a-data-fabric-and-why-should-you-care.html)

[Data Fabric Architecture is Key to Modernizing Data Management and Integration](https://www.gartner.com/smarterwithgartner/data-fabric-architecture-is-key-to-modernizing-data-management-and-integration)

[What is Data Fabric? Trifacta](https://www.trifacta.com/blog/what-is-data-fabric/)

[Data Fabric Explained: Concepts, Capabilities & Value Props](https://www.bmc.com/blogs/data-fabric/)

[What are the principles that define data fabric?](https://www.e-spincorp.com/what-are-the-principles-that-define-data-fabric/)

[An introduction to the concept of Data Fabric](https://lingarogroup.com/blog/is-data-fabric-the-future-of-data-management-platforms/)

[ATSCALE: What is a Data Fabric?](https://www.atscale.com/blog/what-is-a-data-fabric/)

[Data Fabric Explained by Ellen Fridman and Ted Dunning](https://www.youtube.com/watch?v=0Zzn4eVbqfk)

[Managing Data Fabric architecture for data-driven business challenges](https://www.softtek.eu/en/tech-magazine-en/data-ecosystem-en/managing-data-fabric-architecture-for-data-driven-business-challenges/)

### 8.2 Architecture

[Data Fabric Architecture: Advantages and Disadvantages](https://www.itprotoday.com/analytics-and-reporting/data-fabric-architecture-advantages-and-disadvantages)

[Comparing Data Fabric vs Data Virtualization](https://atlan.com/data-fabric-vs-data-virtualization/)

[What's a data fabric and how does it work?](https://www.youtube.com/watch?v=qi6sTvu8osk)

[Metadata and Data Virtualization Explained](https://www.altoros.com/blog/metadata-and-data-virtualization/#:~:text=From%20metadata%20to%20data%20virtualization,in%20a%20single%20virtual%20warehouse.)

### 8.3 Deep Dive

[Data Mesh Vs. Data Fabric: Understanding the Differences](https://www.datanami.com/2021/10/25/data-mesh-vs-data-fabric-understanding-the-differences/)

[The top 6 use cases for a data fabric architecture](https://searchdatamanagement.techtarget.com/feature/The-top-6-use-cases-for-a-data-fabric-architecture)

[What is Data Fabric](https://www.tibco.com/reference-center/what-is-data-fabric#:~:text=Data%20fabric%20is%20an%20end,helps%20organizations%20manage%20their%20data.)

[Data Fabric TechTarget](https://searchdatamanagement.techtarget.com/definition/data-fabric)

[Data Fabric: What is it and Why Do You Need it?](https://www.striim.com/data-fabric-what-is-it-and-why-do-you-need-it/)

- - - - - -

## References and links
- CaraDonna, J. and Lent, A. *NetApp Data Fabric Architecture Fundamentals. White Paper.* Infoworks.
- D.Tupper, C. *Data Architecture: From Zen to Reality* (1st ed.). ELSEVIER.
- LaPlante, A. *Data Fabric as Modern Data Architecture. Report.* (1st ed.). O'Reilly.
- Wells, D. *Data Fabric: Smart Data Engineering, Operations and Orchestration* Infoworks.
- Pattanayak, A. *High Performance Analytics with SAP HANA Virtual Models.* Scientific Research Publishing Inc.
- Freeman, L. and C. Miller, L. *Hybrid Cloud & Data Fabric For Dummies, NetApp Special Edition* John Wiley & Sons, Inc. 
- [More Resources like this here](https://carlosgrande.me/#resources-cheatsheets/)