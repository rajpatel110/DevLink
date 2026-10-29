import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";

const Chat = ({ userId }) => {
    const currentUser = useSelector((state) => state.user);
    const [connections, setConnections] = useState([]);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [loadingOlder, setLoadingOlder] = useState(false);
    const bottom = useRef(null);
    const activeUser = useRef(userId);
    useEffect(() => {
        activeUser.current = userId;
        let cancelled = false;
        let timer;
        const refresh = async (initial = false) => {
            try {
                const response = await axios.get(`${BASE_URL}/chat/${userId}`, { withCredentials: true });
                if (cancelled) return;
                setMessages((previous) => {
                    const merged = new Map(previous.map((message) => [message._id, message]));
                    response.data.data.forEach((message) => merged.set(message._id, message));
                    return [...merged.values()].sort((a, b) => a._id.localeCompare(b._id));
                });
                if (initial) setHasMore(response.data.hasMore);
                setError("");
            } catch (err) {
                if (!cancelled) setError(err.response?.data?.message || "Unable to load chat. Check your connection.");
            } finally {
                if (!cancelled) {
                    setLoading(false);
                    timer = setTimeout(() => refresh(), 3000);
                }
            }
        };
        axios.get(`${BASE_URL}/user/connections`, { withCredentials: true })
            .then((response) => { if (!cancelled) setConnections(response.data.data); })
            .catch(() => { if (!cancelled) setError("Unable to load connections."); })
            .finally(() => { if (!cancelled && !userId) setLoading(false); });
        if (userId) refresh(true);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [userId]);

    const lastMessageId = messages.at(-1)?._id;
    useEffect(() => { bottom.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, [lastMessageId]);

    const loadOlder = async () => {
        const selectedUser = userId;
        setLoadingOlder(true);
        try {
            const response = await axios.get(`${BASE_URL}/chat/${userId}`, {
                withCredentials: true, params: { before: messages[0]._id },
            });
            if (activeUser.current !== selectedUser) return;
            setMessages((previous) => {
                const merged = new Map([...response.data.data, ...previous].map((message) => [message._id, message]));
                return [...merged.values()].sort((a, b) => a._id.localeCompare(b._id));
            });
            setHasMore(response.data.hasMore);
        } catch { if (activeUser.current === selectedUser) setError("Unable to load older messages."); }
        finally { if (activeUser.current === selectedUser) setLoadingOlder(false); }
    };

    const send = async (event) => {
        event.preventDefault();
        if (!text.trim() || sending) return;
        const selectedUser = userId;
        setSending(true);
        setError("");
        try {
            const response = await axios.post(`${BASE_URL}/chat/${userId}`, { text }, { withCredentials: true });
            if (activeUser.current !== selectedUser) return;
            setMessages((previous) => previous.some((message) => message._id === response.data.data._id)
                ? previous : [...previous, response.data.data].sort((a, b) => a._id.localeCompare(b._id)));
            setText("");
        } catch (err) {
            if (activeUser.current === selectedUser) setError(err.response?.data?.message || "Message was not sent. Please try again.");
        } finally { if (activeUser.current === selectedUser) setSending(false); }
    };

    const recipient = connections.find((connection) => connection._id === userId);
    return (
        <main className="max-w-5xl mx-auto p-4 min-h-screen">
            <h1 className="text-3xl font-bold my-6">Messages</h1>
            <div className="grid md:grid-cols-[240px_1fr] gap-4">
                <aside className="bg-base-200 rounded-box p-4">
                    <h2 className="font-semibold mb-3">Your connections</h2>
                    {connections.map((connection) => (
                        <Link key={connection._id} to={`/chat/${connection._id}`}
                            className={`btn w-full mb-2 justify-start ${userId === connection._id ? "btn-primary" : "btn-ghost"}`}>
                            {connection.firstName} {connection.lastName}
                        </Link>
                    ))}
                    {!loading && !connections.length && <p>No connections yet. Accept a connection to start chatting.</p>}
                    <Link className="link block mt-4" to="/connections">View connections</Link>
                </aside>
                <section className="bg-base-200 rounded-box p-4 min-w-0">
                    <h2 className="font-semibold border-b border-base-300 pb-3">
                        {recipient ? `${recipient.firstName} ${recipient.lastName || ""}` : "Choose a connection"}
                    </h2>
                    {error && <p role="alert" className="text-error my-3">{error}</p>}
                    <div className="h-[50vh] overflow-y-auto py-4" role="log" aria-label="Chat messages">
                        {loading && <p>Loading...</p>}
                        {hasMore && <button className="btn btn-sm block mx-auto" disabled={loadingOlder} onClick={loadOlder}>{loadingOlder ? "Loading..." : "Load older messages"}</button>}
                        {!loading && userId && !messages.length && !error && <p>Say hello to start your conversation.</p>}
                        {messages.map((message) => (
                            <div key={message._id} className={`chat ${String(message.senderId) === String(currentUser?._id) ? "chat-end" : "chat-start"}`}>
                                <div className="chat-bubble whitespace-pre-wrap break-words max-w-[85%]">{message.text}</div>
                                <time className="chat-footer opacity-60 text-xs">{new Date(message.createdAt).toLocaleString()}</time>
                            </div>
                        ))}
                        <div ref={bottom} />
                    </div>
                    {userId && <form onSubmit={send} className="flex gap-2 pt-3 border-t border-base-300">
                        <textarea aria-label="Message" placeholder="Write a message..." maxLength={2000} rows={2}
                            className="textarea textarea-bordered flex-1 min-w-0" value={text} disabled={sending} onChange={(event) => setText(event.target.value)} />
                        <button className="btn btn-primary" disabled={sending || loading || !text.trim()}>{sending ? "Sending..." : "Send"}</button>
                    </form>}
                </section>
            </div>
        </main>
    );
};
const ChatPage = () => {
    const { userId } = useParams();
    return <Chat key={userId || "inbox"} userId={userId} />;
};
export default ChatPage;

