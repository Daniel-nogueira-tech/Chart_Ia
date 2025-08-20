import { createContext, useState } from "react";
import run from "../config/gemini";
import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "../custom-prism/custom-prism.css";

// Cria o contexto
export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const onSent = async (prompt) => {
    if (!prompt.trim()) return;

    setLoading(true);
    setShowResult(true);

    // Adiciona a nova conversa com a mensagem do usuário e resposta vazia
    setPrevPrompts((prev) => [
      ...prev,
      { user: prompt, bot: "", loading: true },
    ]);

    // Obtém a resposta do modelo
    const response = await run(prompt);

    // Formata a resposta: textos entre "**" ficam em negrito
    const responseArray = response.split("**");
    let formattedResponse = "";
    for (let i = 0; i < responseArray.length; i++) {
      formattedResponse += i % 2 === 1 
        ? `<b>${responseArray[i]}</b>` 
        : responseArray[i];
    }

    // Substitui "*" por quebras de linha
    formattedResponse = formattedResponse.replace(/\*/g, "<br><br>");

    // Detecta blocos de código delimitados por ``` e os envolve em <pre><code>
    formattedResponse = formattedResponse.replace(
      /```([\s\S]*?)```/g,
      (match, code) =>
        `<pre class="custom-code"><code class="language-javascript">${code.trim()}</code></pre>`
    );

    // Se a resposta conter blocos de código, exibe-a imediatamente
    if (formattedResponse.includes("<pre")) {
      setPrevPrompts((prev) => {
        const newPrev = [...prev];
        const lastIndex = newPrev.length - 1;
        newPrev[lastIndex] = {
          ...newPrev[lastIndex],
          bot: formattedResponse,
          loading: false,
        };
        return newPrev;
      });
      setLoading(false);
      Prism.highlightAll();
    } else {
      // Caso contrário, utiliza o efeito typewriter para exibir a resposta gradualmente
      const newResponseArray = formattedResponse.split("");
      newResponseArray.forEach((char, index) => {
        setTimeout(() => {
          setPrevPrompts((prev) => {
            const newPrev = [...prev];
            const lastIndex = newPrev.length - 1;
            newPrev[lastIndex] = {
              ...newPrev[lastIndex],
              bot: newPrev[lastIndex].bot + char,
            };
            return newPrev;
          });
        }, 20 * index);
      });
  
      // Após o efeito, desativa o loading e aplica o highlight
      setTimeout(() => {
        setPrevPrompts((prev) => {
          const newPrev = [...prev];
          const lastIndex = newPrev.length - 1;
          newPrev[lastIndex] = { ...newPrev[lastIndex], loading: false };
          return newPrev;
        });
        setLoading(false);
        Prism.highlightAll();
      }, 20 * newResponseArray.length);
    }

    setInput(""); // Limpa o campo de entrada
  };

  const ContextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    showResult,
    loading,
    resultData,
    input,
    setInput,
  };

  return (
    <Context.Provider value={ContextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
