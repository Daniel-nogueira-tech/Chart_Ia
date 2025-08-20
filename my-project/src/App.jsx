import React, { useContext } from 'react';
import './App.css';
import { assets } from './assets/assets';
import { Context } from './context/Context';

function App() {
  const { prevPrompts, onSent, input, setInput } = useContext(Context);

  const handleSend = async () => {
    if (!input.trim()) return; // Evita enviar mensagens vazias

    // Salva o valor atual do input e limpa o campo
    const currentInput = input;
    setInput('');

    // Chama a função onSent que já cuida de adicionar a nova conversa ao histórico
    onSent(currentInput);
  };

  return (
    <div className="app">
      <div className="sideBar">
        <div className="upperSide">
          <div className="upperSideTop">
            <img src={assets.gptLogo} alt="Logo" className="logo" />
            <span className="brad">ChatBot</span>
          </div>
          <button className="midBtn">
            <img src={assets.add} alt="New chat" className="addBtn" />
            New chat
          </button>
        </div>

        {prevPrompts.length === 0 && (
          <div className="upperSideBottom">
            <button className="query">
              <img src={assets.msg} alt="Mensagem" />
              O que é programação?
            </button>
            <button className="query">
              <img src={assets.msg} alt="Mensagem" />
              Como usar uma API?
            </button>
          </div>
        )}


        <div className="lowerSide">
          <div className="listItems">
            <img className="listItemsImg" src={assets.home} alt="Inicio" />
            Inicio
          </div>
          <div className="listItems">
            <img className="listItemsImg" src={assets.saved} alt="Salvo" />
            Salvo
          </div>
          <div className="listItems">
            <img className="listItemsImg" src={assets.upgrade} alt="Upgrade" />
            Upgrade
          </div>
        </div>
      </div>

      <div className="main">
        <div className="chats">
          {prevPrompts.map((conversation, index) => (
            <React.Fragment key={index}>
              {/* Mensagem do Usuário */}
              <div className="chat">
                <img className="chatimg" src={assets.profile_user} alt="User Profile" />
                <p className="txt">{conversation.user}</p>
              </div>

              {/* Mensagem do Bot */}
              <div className="chat bot">
                <img className="chatimg" src={assets.Gpt_profile} alt="Chat Profile" />
                {conversation.loading ? (
                  <div className="loader">
                    <span className="loading-dot"></span>
                    <span className="loading-dot"></span>
                    <span className="loading-dot"></span>
                  </div>
                ) : (
                  <p
                    className="txt"
                    dangerouslySetInnerHTML={{ __html: conversation.bot }}
                  ></p>
                )}
              </div>
            </React.Fragment>
          ))}

          {/* Footer do Chat */}
          <div className="chatFooter">
            <div className="inp">
              <input
                type="text"
                className="chatInput"
                placeholder="Envie uma mensagem..."
                onChange={(e) => setInput(e.target.value)}
                value={input}
              />
              <button className="send" onClick={handleSend}>
                <img src={assets.send} alt="Send" />
              </button>
            </div>
            <p>
              O ChatBot pode cometer erros. Considere verificar informações importantes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
