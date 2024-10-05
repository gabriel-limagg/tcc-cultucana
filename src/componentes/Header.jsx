import '../App.css'; 
import Logo from "../assets/logo-tcc.png";
import Hamburguer from './Hamburguer';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

function Header() {
    // Controla se o chat está aberto ou fechado
    const [chatOpen, setChatOpen] = useState(false);
    // Armazena o valor do input
    const [input, setInput] = useState("");
    // Armazena todas as mensagens
    const [messages, setMessages] = useState([]);
    // Referência para o último elemento
    const messagesEndRef = useRef(null);

    // Função para alternar a visibilidade do chat
    const toggleChat = () => {
        setChatOpen(!chatOpen);
    };

    // Função para formatar retorno
    const formatResponseWithMarkdown = (text) => {
        return text.split('\n').filter(item => item.trim() !== '').map((item, index) => {
            // Verificar se o texto contém tags de negrito ou é um item de lista com negrito
            if (item.startsWith('* **')) {
                // Substituir negrito (**texto**) por <strong> e remover o asterisco inicial
                const formattedItem = item.replace('* **', '<li><strong>').replace('**', '</strong>');
                return <li key={index} dangerouslySetInnerHTML={{ __html: formattedItem }} />;
            }

            // Verificar se a linha começa com "*" (apenas 1 asterisco) e adicionar o hífen
            if (item.startsWith('* ')) {
                // Adicionar um hífen no lugar do asterisco
                const formattedItem = item.replace('* ', '- ');
                return <p key={index}>{formattedItem}</p>;
            }

            // Substituir negrito (**texto**) por <strong>
            const formattedItem = item.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
            
            // Renderizar o parágrafo com negrito
            return <p key={index} dangerouslySetInnerHTML={{ __html: formattedItem }} />;
        });
    };


    // Função para fazer o scroll até o final
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // useEffect que dispara o scroll quando novas mensagens são adicionadas
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Função para enviar a mensagem para o chatbot
    const sendMessageToChatbot = async () => {
        // Não enviar mensagens vazias
        if (input.trim() === "") return;

        // Adiciona a mensagem do usuário ao estado
        setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: input }]);

        // Limpar o input
        setInput("");

        const response = await fetch("http://localhost:5000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: input }),
        });

        const data = await response.json();

        // Adiciona a resposta do chatbot ao estado
        setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: data.response }]);
    };

    return (
        <header>
            {/* Parte superior do Header com links */}
            <div className="justify-items-center relative m-0 p-0 top-0 left-0 bg-fundoHeader">
                <Link to='/'>
                    <img className='w-28 m-auto justify-items-center cursor-pointer' src={Logo} alt="Logo"/>
                </Link>
                <div className='md:hidden m-auto'>
                    <Hamburguer />
                </div>
            </div>
            <div className="mt-9"></div> 
            <div className='hidden md:block'>
                <div className='text-3xl justify-between flex pl-12 pr-12 place-items-center max-[1500px]:text-2xl max-[1200px]:text-xl'>
                    <div>
                        <Link to='/apresentacao'>
                            <h2 className='font-aleo text-stone-300 cursor-pointer'>Apresentação</h2>
                        </Link>
                    </div>
                    <div>
                        <Link to='/guia-de-utilizacao'>
                            <h2 className='font-aleo text-stone-300 cursor-pointer'>Guia de ultilização</h2>
                        </Link>
                    </div>
                    <div>
                        <Link to='/materiais'>
                            <h2 className='font-aleo text-stone-300 cursor-pointer'>Materiais utilizados</h2>
                        </Link>
                    </div>
                    
                    <div>
                        <Link to='/quem-somos'>
                            <h2 className='font-aleo text-stone-300 cursor-pointer'>Quem somos nós</h2>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Chatbot Pop-up */}
            {chatOpen && (
                <div className="chat-popup">
                    <h3 className="chat-header">Chatbot</h3>
                    <div id="chat-container" className="chat-container">
                        {/* Mensagem inicial */}
                        <p className="chat-message bot">
                            <strong>Cutú</strong> Olá, meu amigo! <br/><br/>
                            Está preparado para aprender mais sobre o cultivo de cana-de-açúcar?<br/>
                            <br/>
                            Em que parte do processo você gostaria de começar hoje?


                        </p>
                        {/* Renderizando todas as mensagens */}
                        {messages.map((message, index) => (
                            <div key={index} className={`chat-message ${message.sender}`}>
                                <p>
                                    <strong>{message.sender === 'user' ? 'Você' : 'Cutú'}</strong>
                                </p>
                                <div>{formatResponseWithMarkdown(message.text)}</div>
                            </div>
                        ))}
                        {/* Div invisível que será usada para fazer o scroll */}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="chat-input-container">
                        <input
                            type="text"
                            id="chat-input"
                            className="chat-input"
                            placeholder="Digite sua mensagem"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => {
                                // Enviar mensagem ao pressionar Enter  
                                if (e.key === 'Enter') {
                                    sendMessageToChatbot();
                                }
                            }}
                        />
                        <button
                            onClick={sendMessageToChatbot}
                            className="chat-send-btn"
                        >
                            Enviar
                        </button>
                    </div>
                </div>
            )}

            {/* Botão de Bolinha para abrir e fechar o chatbot */}
            <button
                onClick={toggleChat}
                className="chat-toggle-btn"
            >
                {chatOpen ? (
                    // Ícone de fechar (X)
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    // Ícone de abrir (+ ou chat)
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h8m-4-4v8" />
                    </svg>
                )}
            </button>
        </header>
    );
}

export default Header;

