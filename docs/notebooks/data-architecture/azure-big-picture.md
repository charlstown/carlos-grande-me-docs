---
short_title: Azure Big Picture
description: none
date: 2021-12-05
thumbnail: assets/images/thumbnails/azure-big-picture-portrait.jpg
---

# Azure Big Picture

![Azure Big Picture - Soviet control room](https://carlosgrande.me/wp-content/uploads/2021/09/2109_AzureBigPicture.jpg){ .image-caption }

I recently grabbed some notes about Azure services on a course from Walt Ritscher. I really think the contents of this course are great to understand the Azure big picture ecosystem.

- - - - - -

## What is a cloud computing Model?

According to the National Institute of Standards and Technologies (NIST), cloud computing is a model for enabling convenient, on-demand network access to a shared pool of configurable computing resources (networks, servers, storage, applications, and services) that can be rapidly provisioned and released with minimal management effort or service provider interaction. Being a cloud computing provider doesn’t mean just supplementing IT resources, it means providing strategic, core information technology.

This cloud model is composed of five essential characteristics:
- On-demand self-service
- Broad network access
- Resource pooling
- Rapid elasticity
- Measured Service

## Hosting

### Azure App Service

Azure App Service is a fully managed web hosting service for building web applications, services and RESTful APIs.

Quickly build, deploy, and scale web apps and APIs on your terms. Work with .NET, .NET Core, Node.js, Java, Python, or PHP in containers or running on Windows or Linux.

![Azure APP Service Architecture](https://carlosgrande.me/wp-content/uploads/2021/09/benefit-2.png)

Azure APP Service Architecture

### Azure Service Fabric

Azure Service Fabric is a distributed systems platform that makes it easy to package, deploy, and manage scalable and reliable microservices and containers. Service Fabric also addresses the significant challenges in developing and managing cloud native applications.

A key differentiator of Service Fabric is its strong focus on building stateful services. You can use the Service Fabric programming model or run containerized stateful services written in any language or code. You can create Service Fabric clusters anywhere, including Windows Server and Linux on premises and other public clouds, in addition to Azure.

### Azure Virtual Machines

An Azure virtual machine is an on-demand, scalable computer resource that is available in Azure. Virtual machines are generally used to host applications when the customer requires more control over the computing environment than what is offered by other compute resources.

### Versus

| Technology           | Service type | Use case                                                                                   |
|----------------------|--------------|--------------------------------------------------------------------------------------------|
| Azure App Service    | PaaS         | Use App Service when you need a fully managed hosting platform for your web apps.          |
| Service Fabric       | PaaS         | Use Service Fabric when you need more control over, or direct access to, the underlying infrastructure. |
| Virtual Machines     | IaaS         | Use Virtual Machines when you need a total control over the infrastructure and the computing environment. |

## Serverless Areas

### Azure Functions

Azure Functions is a cloud service available on-demand that provides all the continually updated infrastructure and resources needed to run your applications. You focus on the pieces of code that matter most to you, and Functions handles the rest. Functions provides serverless compute for Azure.

### Azure Durable Functions

Durable Functions is an extension of Azure Functions that lets you write stateful functions in a serverless compute environment. The extension lets you define stateful workflows by writing orchestrator functions and stateful entities by writing entity functions using the Azure Functions programming model.

### Azure WebJobs

WebJobs is a feature of Azure App Service that enables you to run a program or script in the same instance as a web app, API app, or mobile app. There is no additional cost to use WebJobs.

You can use the Azure WebJobs SDK with WebJobs to simplify many programming tasks. WebJobs is not yet supported for App Service on Linux. There are two kinds of WebJob:

**Continuous:** They execute in a continuous loop. For example, you could use a continuous WebJob to check a shared folder for a new photo.

**Triggered:** Can be executed manually or on a schedule.

### Versus

| Technology              | Use Case                                                                                                                                                                                                 |
|-------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Azure Functions         | Azure functions are best suited for **smaller apps have events that can work independently of other websites**. An Azure Functions is in many ways similar to a WebJob, the main difference between them being that you don’t need to worry about the infrastructure at all. |
| Azure Durable Functions | Durable Functions is an extension of Azure Functions that lets you write stateful functions in a serverless compute environment.                                                                          |
| Azure WebJobs           | If you have an App Service app for which you want to run code snippets, and you want to manage them together in the same DevOps environment, use WebJobs.                                                |

## Workflows

Microsoft offers a few ‘no-code’ automation solutions within Azure/Microsoft 365. If we take a look at the moment popular ones: Logic Apps and Power Automate.

When we put the two next to each other, you will see that they look mostly alike. The ‘code’ blocks are often the same between Power Automate and Logic Apps. The only main visual difference between the two is the portal were you build them.

### Azure Logic Apps

Azure Logic Apps is a cloud-based platform for creating and running automated workflows that integrate your apps, data, services, and systems. With this platform, you can quickly develop highly scalable integration solutions for your enterprise and business-to-business (B2B) scenarios.

### Microsoft Power Automate

Power Automate is a service that helps you create automated workflows between your favorite apps and services to synchronize files, get notifications, collect data, and more.

### Versus

| Technology             | Use Case |
|------------------------|----------|
| Azure Logic Apps       | *Azure Logic Apps* provide the same user-friendly designer surface similar to Power Automate with the option to build complex integration solutions, utilise advanced development tools, DevOps and monitoring, if required. |
| Microsoft Power Automate | *Power Automate* provides a user-friendly and focused experience within Office 365 that can easy to get end-users going once assigned an appropriate license. |

## Storage & Data

### Blob storage

Blob Storage is Microsoft Azure’s service for storing binary large objects or blobs which are typically composed of unstructured data such as text, images, and videos, along with their metadata. Blobs are stored in directory-like structures called “containers.”

**Blob Storage Categories**
Although blob allows for storage of large binary objects in Azure, these are optimized for three different storage scenarios:
- **Block blobs:** These are blobs that are intended to store discrete objects such as images, log files and more. Block blobs can store data up to ~5TB, or 50,000 blocks of up to 100MB each.
- **Page blobs:** These are optimized for random read and write operations and can grow up to 8TB in size. Within the page blob category, Azure offers two types of storage: standard and premium. The latter is the most ideal for virtual machine (VM) storage disks (including the operating system disk).
- **Append Blobs:** Optimized for append scenarios like log storage, append blogs are composed of several blocks of different sizes — up to a maximum of 4MB. Each append blob can hold up to 50,000 blocks, therefore allowing each append blob to grow up to 200GB.

### File storage

Azure Files offers fully managed file shares in the cloud that are accessible via the industry standard Server Message Block (SMB) protocol or Network File System (NFS) protocol. Azure Files file shares can be mounted concurrently by cloud or on-premises deployments. SMB Azure file shares are accessible from Windows, Linux, and macOS clients. NFS Azure Files shares are accessible from Linux or macOS clients.

### Queue storage

Azure Queue Storage is a service for storing large numbers of messages. You access messages from anywhere in the world via authenticated calls using HTTP or HTTPS. A queue message can be up to 64 KB in size. A queue may contain millions of messages, up to the total capacity limit of a storage account. Queues are commonly used to create a backlog of work to process asynchronously.

- **Storage queues:** are part of the Azure Storage infrastructure. They allow you to store large numbers of messages. You access messages from anywhere in the world via authenticated calls using HTTP or HTTPS. A queue message can be up to 64 KB in size. A queue may contain millions of messages, up to the total capacity limit of a storage account. Queues are commonly used to create a backlog of work to process asynchronously. For more information, see What are Azure Storage queues.

- **Service Bus queues:** are part of a broader Azure messaging infrastructure that supports queuing, publish/subscribe, and more advanced integration patterns. They're designed to integrate applications or application components that may span multiple communication protocols, data contracts, trust domains, or network environments.

### Disk storage

Designed to be used with *Azure Virtual Machines and Azure VMware Solution*, Azure Disk Storage offers high-performance, durable block storage for your mission- and business-critical applications. Confidently migrate to Azure infrastructure with four disk storage options for the cloud—–Ultra Disk Storage, Premium SSD, Standard SSD, and Standard HDD—to optimize costs and performance for your workload. Get high performance with sub-millisecond latency for throughput and transaction-intensive workloads such as SAP HANA, SQL Server, and Oracle.

### Azure SQL Database

Azure SQL Database is a fully managed platform as a service (PaaS) database engine that handles most of the database management functions such as upgrading, patching, backups, and monitoring without user involvement. Azure SQL Database is always running on the latest stable version of the SQL Server database engine and patched OS with 99.99% availability. PaaS capabilities that are built into Azure SQL Database enable you to focus on the domain-specific database administration and optimization activities that are critical for your business.

### Azure SQL Data Warehouse

Azure SQL Data Warehouse (SQL DW) is a cloud-based Platform-as-a-Service (PaaS) offering from Microsoft. It is a large-scale, distributed, MPP (massively parallel processing) relational database technology in the same class of competitors as Amazon Redshift or Snowflake. Azure SQL DW is an important component of the Modern Data Warehouse multi-platform architecture.

### Azure Data Lake Store (DLS)

Azure Data Lake Storage Gen2 is a set of capabilities dedicated to big data analytics, built on Azure Blob Storage.

Data Lake Storage Gen2 converges the capabilities of Azure Data Lake Storage Gen1 with Azure Blob Storage. For example, Data Lake Storage Gen2 provides file system semantics, file-level security, and scale. Because these capabilities are built on Blob storage, you'll also get low-cost, tiered storage, with high availability/disaster recovery capabilities.

### Azure Cosmos DB

Azure Cosmos DB is a fully managed NoSQL database for modern app development. Single-digit millisecond response times, and automatic and instant scalability, guarantee speed at any scale. Business continuity is assured with SLA-backed availability and enterprise-grade security. App development is faster and more productive thanks to turnkey multi region data distribution anywhere in the world, open source APIs and SDKs for popular languages. As a fully managed service, Azure Cosmos DB takes database administration off your hands with automatic management, updates and patching. It also handles capacity management with cost-effective serverless and automatic scaling options that respond to application needs to match capacity with demand.

### Table Storage

Azure Table storage is a service that stores non-relational structured data (also known as structured NoSQL data) in the cloud, providing a key/attribute store with a schemaless design. Because Table storage is schemaless, it's easy to adapt your data as the needs of your application evolve. Access to Table storage data is fast and cost-effective for many types of applications, and is typically lower in cost than traditional SQL for similar volumes of data.

## Infrastrucutre

### Azure Active Directory

Azure Active Directory (Azure AD) is Microsoft’s cloud-based identity and access management service, which helps your employees sign in and access resources in:
- External resources, such as Microsoft 365, the Azure portal, and thousands of other SaaS applications.
- Internal resources, such as apps on your corporate network and intranet, along with any cloud apps developed by your own organization. For more information about creating a tenant for your organization, see Quickstart: Create a new tenant in Azure Active Directory.

### Azure Virtual Network

Azure Virtual Network (VNet) is the fundamental building block for your private network in Azure. VNet enables many types of Azure resources, such as Azure Virtual Machines (VM), to securely communicate with each other, the internet, and on-premises networks. VNet is similar to a traditional network that you'd operate in your own data center, but brings with it additional benefits of Azure's infrastructure such as scale, availability, and isolation.

## DevOps

Azure DevOps is a Software as a service (SaaS) platform from Microsoft that provides an end-to-end DevOps toolchain for developing and deploying software.  It also integrates with most leading tools on the market and is a great option for orchestrating a DevOps toolchain.  At DevOpsGroup, we have lots of customers who have found Azure DevOps fits their needs irrespective of their language, platform or cloud.

### Azure Boards

Azure Boards is a service for managing the work for your software projects. Teams need tools that flex and grow. Azure Boards does just that, brining you a rich set of capabilities including native support for Scrum and Kanban, customizable dashboards, and integrated reporting.

### Azure Pipelines

Azure Pipelines combines continuous integration (CI) and continuous delivery (CD) to test and build your code and ship it to any target. ... Continuous Delivery (CD) is a process by which code is built, tested, and deployed to one or more test and production environments.

### Azure Repos

Azure Repos is a set of version control tools that you can use to manage your code. ... Version control systems are software that help you track changes you make in your code over time. As you edit your code, you tell the version control system to take a snapshot of your files.

### Azure Test Plans

Azure Test Plans, a service launched with Azure DevOps, provides a browser-based test management solution for exploratory, planned manual, and user acceptance testing. Azure Test Plans also provides a browser extension for exploratory testing and gathering feedback from stakeholders.

### Azure Artifacts

Azure Artifacts enables developers to share and consume packages from different feeds and public registries. Packages can be shared within the same team, the same organization, and even publicly. Azure Artifacts supports multiple package types such as NuGet, Npm, Python, Maven, and Universal Packages.

## Machine Learning

### Azure Cognitive Services

Azure Cognitive Services are cloud-based services with REST APIs and client library SDKs available to help you build cognitive intelligence into your applications. You can add cognitive features to your applications without having artificial intelligence (AI) or data science skills.

### Azure Machine Learning

Azure Machine Learning is a cloud service for accelerating and managing the machine learning project lifecycle. Machine learning professionals, data scientists, and engineers can use it in their day-to-day workflows: Train and deploy models, and manage MLOps.

You can create a model in Azure Machine Learning or use a model built from an open-source platform, such as Pytorch, TensorFlow, or scikit-learn. MLOps tools help you monitor, retrain, and redeploy models.

### Bot Service

Azure Bot Service is a managed bot development service that helps you seamlessly connect to your users via popular channels. Pay only for messages delivered using Premium channels, which allow your bot to communicate with users within your own application or on your website.

### Azure Cognitive Search

Azure Cognitive Search (formerly known as "Azure Search") is a cloud search service that gives developers infrastructure, APIs, and tools for building a rich search experience over private, heterogeneous content in web, mobile, and enterprise applications

## Streaming

### Service Bus

Azure Service Bus is a fully managed enterprise message broker with message queues and publish-subscribe topics (in a namespace). Service Bus is used to decouple applications and services from each other, providing the following benefits: Load-balancing work across competing workers.

### Event Grid

Azure Event Grid allows you to easily build applications with event-based architectures. ... Event Grid has built-in support for events coming from Azure services, like storage blobs and resource groups. Event Grid also has support for your own events, using custom topics.

### Event Hubs

Azure Event Hubs is a big data streaming platform and event ingestion service. It can receive and process millions of events per second. Data sent to an event hub can be transformed and stored by using any real-time analytics provider or batching/storage adapters.

### Azure Notification Hubs

Azure Notification Hubs provide an easy-to-use and scaled-out push engine that enables you to send notifications to any platform (iOS, Android, Windows, etc.) from any back-end (cloud or on-premises). Notification Hubs works great for both enterprise and consumer scenarios.

## Other Services

### Media Services

- Azure Video encoding
- Azure Streaming
- Azure Video Indexer
- Azure Content Protection
- Azure Content Delivery Network
- Azure Media Player

### IoT Services

- IoT Central
- IoT HUB
- IoT EDGE

## Virtual Desktop

Microsoft Azure Virtual Desktop is a cloud-based virtual desktop and application platform that runs in Azure and has exclusive features like Windows 10 enterprise multi-session. This offering allows multiple users to concurrently connect to a remote desktop on a Windows 10 virtual machine for a familiar user experience with optimal app compatibility and no RDS CAL licensing. Windows 7 is also available with extended support so you can run your legacy apps securely and efficiently in the cloud.

- - - - - -

## References and links

- [Azure documentation](https://docs.microsoft.com/en-us/azure/?product=featured)
- [Lern Azure](https://docs.microsoft.com/en-us/learn/browse/?products=azure&resource_type=learning%20path)
- [More Notebooks like this here](https://carlosgrande.me/category/myworks/notebooks/)
