---
short_title: Mi tesis sobre los LLM
description: Una tesis personal sobre los grandes modelos de lenguaje.
date: 2026-11-14
thumbnail: assets/images/thumbnails/the-8-levels-of-ai-development.png
toc_depth: 2
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

---

## 9.1 El asistente conversacional como sistema

### 9.1.1 Anatomía y tamaño de un modelo conversacional

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
