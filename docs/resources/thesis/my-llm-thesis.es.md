---
short_title: Mi tesis sobre los LLM
description: Una tesis personal sobre los grandes modelos de lenguaje.
date: 2026-11-14
thumbnail: assets/images/thumbnails/the-8-levels-of-ai-development.png
toc_depth: 3
---

# Mi tesis sobre los LLM

<!-- Introducción pendiente de añadir. -->

## 1. Contexto y fundamentos

### 1.1 Modelado del lenguaje

Un **LLM** (*large language model*, o gran modelo de lenguaje) es un modelo de lenguaje entrenado a gran escala para procesar y generar texto.

Si tuviese que explicar qué es un modelo de lenguaje en una sola frase, diría que **define una distribución de probabilidad sobre secuencias de tokens o palabras que permite estimar la probabilidad del siguiente token a partir de los anteriores**.

La idea fundamental es que un modelo de lenguaje puede asignar probabilidades diferentes a distintas secuencias: una frase que sigue patrones habituales del lenguaje puede resultar más probable que otra con un orden extraño o un significado poco habitual. Por ejemplo, imaginemos estas probabilidades:

| Secuencia | Probabilidad | Qué ilustra |
| --- | ---: | --- |
| *El ratón se comió el queso* | 0,02 | Una secuencia gramatical y con un significado habitual. |
| *El el ratón se comió queso* | 0,0001 | Una secuencia con un orden gramatical poco habitual. |
| *El queso se comió el ratón* | 0,001 | Una secuencia gramatical, pero con un significado poco habitual. |

Estas probabilidades son ilustrativas: los valores concretos dependen del modelo y de cómo represente las secuencias.

Pero hay una distinción importante: **que una respuesta sea probable no significa necesariamente que sea verdadera**. El modelo estima qué secuencias encajan con el contexto; esa probabilidad, por sí sola, no garantiza que la información sea correcta.

Muchos de los LLM que usamos hoy son **modelos de lenguaje autorregresivos** (*autoregressive language models*, o AR). Su idea clave es descomponer la probabilidad de una secuencia en las probabilidades de sus tokens, uno a uno y teniendo en cuenta los anteriores:

$$
P(x_1, \ldots, x_L) = P(x_1)\,P(x_2 \mid x_1)\,P(x_3 \mid x_1, x_2)\,\cdots = \prod_{i=1}^{L} P(x_i \mid x_1, \ldots, x_{i-1})
$$

Aquí, cada $x_i$ representa un token. La ecuación multiplica la probabilidad del primero por la del segundo dado el primero, por la del tercero dados los dos anteriores, y así sucesivamente hasta completar la secuencia.

Esta descomposición es la **regla de la cadena de la probabilidad**: es una igualdad exacta, no una aproximación. La idea de un modelo autorregresivo es aprender a estimar la probabilidad del siguiente token a partir del contexto anterior; repitiendo el proceso, puede generar una secuencia completa.

### 1.2 El proceso de predecir el siguiente token

Veamos el proceso a alto nivel con un ejemplo: **«Mi mascota es un»**. El objetivo es predecir el siguiente token que continúa la secuencia.

--8<-- "assets/decks/next-token-prediction.html:diagram"

1. **Entrada:** Partimos del texto «Mi mascota es un» y buscamos qué token puede venir después.
2. **Tokenización:** El tokenizador divide el texto en tokens y asigna a cada uno su ID según el vocabulario del modelo, siguiendo la misma correspondencia utilizada durante su entrenamiento. Una palabra que no aparece como token completo puede dividirse en fragmentos conocidos.
3. **Embeddings:** Los IDs se convierten en vectores que representan los tokens y sirven de entrada al modelo.
4. **Procesamiento:** El *transformer* procesa esos vectores teniendo en cuenta el contexto y genera representaciones contextualizadas. Una proyección de salida produce una puntuación (*logit*) para cada posible siguiente token.
5. **Probabilidades:** La función *softmax* transforma esos logits en una distribución de probabilidades sobre los posibles siguientes tokens.
6. **Selección:** Mediante una estrategia de selección o *sampling*, se elige un token, por ejemplo, uno que complete «Mi mascota es un perro».

El token elegido se añade a la secuencia y el proceso se repite para generar el siguiente, tantas veces como sea necesario hasta que se detenga la generación. Un token no siempre equivale a una palabra completa.

### 1.3 Fases de entrenamiento e inferencia

Antes de poder responder a nuestras preguntas, un modelo pasa por distintas etapas de entrenamiento. Una vez entrenado, lo utilizamos mediante la **inferencia**. A alto nivel, podemos distinguir estas fases:

**Entrenamiento**

1. **Preentrenamiento:** El modelo aprende patrones del lenguaje a partir de grandes cantidades de datos, por ejemplo, entrenándose para predecir el siguiente token.
2. **Ajuste fino** (*fine-tuning*): El modelo continúa entrenándose con datos más específicos para adaptar su comportamiento, por ejemplo, a seguir instrucciones o mantener conversaciones.
3. **Aprendizaje por refuerzo con feedback humano** (*reinforcement learning from human feedback* o RLHF): De forma opcional, se utilizan preferencias humanas para orientar el comportamiento del modelo hacia respuestas consideradas más útiles o adecuadas.

**Inferencia**

4. **Generación de respuestas:** Una vez entrenado, el modelo recibe una entrada y utiliza sus parámetros para predecir y generar tokens, como vimos en el apartado anterior. En este proceso los parámetros del modelo normalmente no se modifican.

## 2. Tipologías de modelos

### 2.1 Según su arquitectura

Antes de 2017, muchas de las arquitecturas dominantes para generar y traducir texto se apoyaban en **redes recurrentes**, como las LSTM y las GRU. Procesaban la secuencia paso a paso, lo que limitaba la paralelización y podía dificultar conservar información relevante a lo largo de textos extensos. Ya se habían propuesto mecanismos de [atención para acceder a distintas partes de la entrada](https://arxiv.org/abs/1409.0473), en lugar de depender únicamente de un resumen de tamaño fijo.

Un cambio decisivo llegó en 2017 con [*Attention is all you need*](https://proceedings.neurips.cc/paper_files/paper/2017/hash/3f5ee243547dee91fbd053c1c4a845aa-Abstract.html), el artículo que presentó el **Transformer**. Su propuesta permitía relacionar directamente los tokens mediante atención, sin recurrencia ni convoluciones, y procesar las posiciones de una secuencia en paralelo dentro de cada capa. Esto facilita especialmente el entrenamiento; durante la generación autorregresiva, los nuevos tokens siguen produciéndose sucesivamente.

Así, las representaciones podían incorporar información contextual y relaciones entre elementos alejados del texto, con una arquitectura mucho más paralelizable. Qué contexto puede utilizar cada token depende del tipo de atención y de las restricciones de la arquitectura.

A partir de estas piezas podemos distinguir tres grandes familias: **encoder-only**, **decoder-only** y **encoder-decoder**. Veamos qué hace cada una y cómo utiliza el contexto.

--8<-- "assets/decks/transformer-architectures.es.html:diagram"

#### 2.1.1 Encoder Only

Un **encoder**, procesa los tokens utilizando atención bidireccional, transforma una entrada en una representación numérica útil para otra tarea como clasificación, reconocimiento de entidades, búsqueda semántica, etc. Esta función ya existía en arquitecturas anteriores al Transformer, incluidas las recurrentes. En los encoders de tipo Transformer que estamos viendo, el resultado es **una lista de números por token que lo representa según su contexto**: un vector o *embedding contextual*.

Un modelo **encoder-only** utiliza el bloque codificador del Transformer como base, sin incorporar un bloque decodificador. Puede añadir una salida específica para cada tarea. En los encoders bidireccionales, cada token puede atender tanto al contexto anterior como al posterior.

Podemos imaginarlo como la parte que «lee» la frase y representa cada elemento dentro de su contexto. Por ejemplo, «banco» puede tener vectores distintos en «Me senté en el banco» y «Pedí un préstamo al banco», aunque la palabra se escriba exactamente igual.

Esto permite comparar representaciones por **características aprendidas relacionadas con el significado y el contexto**, más allá de contar letras o comparar cómo se escriben las palabras. La función del encoder es transformar la entrada en información útil para la tarea que viene después.

En 2018, Google presentó [*BERT: Pre-training of deep bidirectional transformers for language understanding*](https://research.google/pubs/bert-pre-training-of-deep-bidirectional-transformers-for-language-understanding/), un punto de inflexión para los modelos basados en encoders. Su preentrenamiento permitía aprender representaciones bidireccionales: cada token podía utilizar información tanto de lo que aparecía antes como de lo que aparecía después.

#### 2.1.2 Decoder only

Utiliza atención causal y predice el siguiente token a partir de los anteriores.


#### 2.1.3 Encoder-decoder

El Encoder procesa toda la entrada y el Decoder genera una secuencia de salida condicionada por ella.

### 2.2 Según sus parámetros

- Modelos densos.
- Modelos mixture of experts (MoE).

### 2.3 Según las modalidades de procesamiento

- Modelos de texto.
- Modelos multimodales: texto, imagen, audio o vídeo.

### 2.4 Características para comparalos

- Tamaño y número de parámetros.
- Ventana de contexto.
- Modalidades admitidas.
- Capacidades y limitaciones.


Entender que es un encoder y un decoder



---

## 3. Cómo se representa la información

---

## 4. Arquitectura Transformer

---

## 5. Ciclo de vida y entrenamiento

---

## 6. Inferencia y generación

---

## 7. Adaptación y conocimiento

Un ejemplo de adaptación es **reutilizar BERT como base preentrenada para distintas tareas**, como análisis de sentimientos o respuesta a preguntas, mediante **ajuste fino**: entrenamiento adicional con ejemplos de la tarea y pocos cambios en la arquitectura. Podemos imaginarlo como una base de propósito general de la que salen modelos adaptados a cada necesidad. El [aprendizaje por transferencia ya tenía antecedentes](https://aclanthology.org/P18-1031/); BERT consolidó esta forma de trabajar con encoders Transformer bidireccionales, sin convertirlos en un modelo que resolviera cualquier tarea directamente.

---

## 8. Razonamiento y uso de herramientas

---

## 9. Arquitecturas de aplicaciones con LLM

### 9.1 El asistente conversacional como sistema

#### 9.1.1 Anatomía y tamaño de un modelo conversacional

Para entender de qué se compone un modelo de lenguaje, tomemos como ejemplo **Llama 2 70B**, desarrollado por Meta, y fijémonos en dos piezas necesarias para ejecutarlo: el **código de inferencia**, que puede escribirse en C y define las operaciones para generar predicciones, y los **parámetros o pesos**, cuyos aproximadamente 70.000 millones dan nombre al modelo.

![Código de inferencia y parámetros de Llama 2 70B](../../assets/images/resources/llm-thesis-model-size.svg)

El **código de inferencia** contiene las instrucciones para ejecutar el modelo: toma los tokens de entrada, aplica las operaciones del transformer utilizando los pesos y calcula las puntuaciones para el siguiente token. El ejemplo de la imagen utiliza una implementación sencilla en C; otras implementaciones pueden tener un tamaño diferente.

Los **parámetros o pesos** son los valores numéricos que el modelo ajusta durante el entrenamiento y que utiliza después para hacer predicciones. Están organizados en matrices y otros componentes: entre ellos, los embeddings de entrada, las capas del transformer y la proyección de salida.

¿De dónde salen los 70.000 millones? Para calcularlos, contamos los valores de cada componente y los sumamos. En Llama 2 70B, el vocabulario tiene 32.000 tokens, las representaciones tienen 8.192 dimensiones y el transformer tiene 80 capas; su dimensión intermedia es 28.672 y sus claves y valores tienen 1.024 dimensiones. Estos datos proceden de la [configuración del modelo](https://huggingface.co/NousResearch/Llama-2-70b-hf/blob/main/config.json).

| Componente | Operación | Parámetros |
| --- | --- | ---: |
| **Embeddings de entrada** | $32.000 \times 8.192$ | 262.144.000 |
| **Atención** en las 80 capas | $80 \times (2 \times 8.192^2 + 2 \times 8.192 \times 1.024)$ | 12.079.595.520 |
| **Redes internas** en las 80 capas | $80 \times 3 \times 8.192 \times 28.672$ | 56.371.445.760 |
| **Normalización** | $(2 \times 80 + 1) \times 8.192$ | 1.318.912 |
| **Proyección de salida** | $32.000 \times 8.192$ | 262.144.000 |
| **Total** | Suma de todos los componentes | **68.976.648.192** |

Así llegamos a unos **69.000 millones de parámetros**, redondeados a **70B** en el nombre. Por ejemplo, la matriz de embeddings contiene una fila por cada token del vocabulario y 8.192 valores por fila; las capas del transformer aportan la mayor parte del total. Profundizaremos en el papel de estas dimensiones y componentes más adelante.

---

## 10. Conclusiones y evolución

---

## 11. Terminología

---

## 12. Discovery roadmap

---

## 13. Referencias

Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., & Polosukhin, I. (2017). Attention is all you need. En I. Guyon, U. von Luxburg, S. Bengio, H. Wallach, R. Fergus, S. Vishwanathan, & R. Garnett (Eds.), *Advances in neural information processing systems* (Vol. 30, pp. 5998–6008). Curran Associates, Inc. [https://proceedings.neurips.cc/paper_files/paper/2017/hash/3f5ee243547dee91fbd053c1c4a845aa-Abstract.html](https://proceedings.neurips.cc/paper_files/paper/2017/hash/3f5ee243547dee91fbd053c1c4a845aa-Abstract.html)
