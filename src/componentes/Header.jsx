import '../App.css'; 
import Logo from "../assets/logo-tcc.png";
import Hamburguer from './Hamburguer';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

function Header() {
   
    const [chatOpen, setChatOpen] = useState(false);
    
    const [input, setInput] = useState("");
   
    const [messages, setMessages] = useState([]);
    
    const messagesEndRef = useRef(null);

    
    const toggleChat = () => {
        setChatOpen(!chatOpen);
    };

    
    const formatResponseWithMarkdown = (text) => {
        return text.split('\n').filter(item => item.trim() !== '').map((item, index) => {
            
            if (item.startsWith('* **')) {
                
                const formattedItem = item.replace('* **', '<li><strong>').replace('**', '</strong>');
                return <li key={index} dangerouslySetInnerHTML={{ __html: formattedItem }} />;
            }

            
            if (item.startsWith('* ')) {
                
                const formattedItem = item.replace('* ', '- ');
                return <p key={index}>{formattedItem}</p>;
            }

            
            const formattedItem = item.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
            
            
            return <p key={index} dangerouslySetInnerHTML={{ __html: formattedItem }} />;
        });
    };


    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    
    const sendMessageToChatbot = async () => {
        
        if (input.trim() === "") return;

       
        setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: input }]);

        
        setInput("");

        const response = await fetch("http://localhost:5000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: input }),
        });

        const data = await response.json();

        
        setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: data.response }]);
    };

    return (
        <header>
           
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

            
            <button
                onClick={toggleChat}
                className="chat-toggle-btn"
            >
                {chatOpen ? (
                    
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                   
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h8m-4-4v8" />
                    </svg>
                )}
            </button>
        </header>
    );
}

export default Header;

