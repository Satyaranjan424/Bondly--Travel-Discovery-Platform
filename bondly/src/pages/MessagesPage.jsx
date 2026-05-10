import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../lib/api.js";
import { useAuth } from "../hooks/useAuth.jsx";
import { useToast } from "../hooks/useToast.jsx";
import { DotsIcon, SearchIcon } from "../components/social/SocialIcons.jsx";

const composerClass = "w-full rounded-full border border-white/10 bg-[#0d1624] px-5 py-3 text-white outline-none placeholder:text-white/28";

export function MessagesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { token, user } = useAuth();
  const { showToast } = useToast();
  const [inbox, setInbox] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [messageBody, setMessageBody] = useState("");
  const [search, setSearch] = useState("");
  const [isInboxLoading, setIsInboxLoading] = useState(true);
  const [isConversationLoading, setIsConversationLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const selectedUserId = searchParams.get("userId") ?? "";

  useEffect(() => {
    const controller = new AbortController();
    setIsInboxLoading(true);

    api
      .getInbox(token, controller.signal)
      .then((response) => {
        const nextInbox = Array.isArray(response.inbox) ? response.inbox : [];
        setInbox(nextInbox);

        if (!selectedUserId && nextInbox[0]?.user?.id) {
          setSearchParams({ userId: nextInbox[0].user.id }, { replace: true });
        }
      })
      .finally(() => {
        setIsInboxLoading(false);
      });

    return () => controller.abort();
  }, [setSearchParams, selectedUserId, token]);

  useEffect(() => {
    if (!selectedUserId) {
      setConversation(null);
      return undefined;
    }

    const controller = new AbortController();
    setIsConversationLoading(true);

    api
      .getConversation(token, selectedUserId, controller.signal)
      .then((response) => {
        const nextConversation = {
          ...response,
          messages: Array.isArray(response.messages) ? response.messages : [],
        };
        setConversation(nextConversation);
        setInbox((current) => {
          const exists = current.some((item) => item.user.id === nextConversation.user.id);
          if (exists) {
            return current;
          }

          return [
            {
              user: nextConversation.user,
              lastMessage: nextConversation.messages.at(-1)?.body || "",
              lastMessageAt: nextConversation.messages.at(-1)?.createdAt || nextConversation.user.createdAt,
              unreadCount: 0,
            },
            ...current,
          ];
        });
      })
      .finally(() => {
        setIsConversationLoading(false);
      });

    return () => controller.abort();
  }, [selectedUserId, token]);

  const filteredInbox = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return inbox;
    }

    return inbox.filter((item) =>
      [item.user.name, item.user.location, item.lastMessage]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [inbox, search]);

  async function handleSendMessage(event) {
    event.preventDefault();
    if (!selectedUserId || !messageBody.trim() || isSending) {
      return;
    }

    setIsSending(true);

    try {
      const response = await api.sendMessage(token, selectedUserId, { body: messageBody });
      const nextConversation = {
        ...response,
        messages: Array.isArray(response.messages) ? response.messages : [],
      };
      setConversation(nextConversation);
      setInbox((current) => {
        const nextItem = {
          user: nextConversation.user,
          lastMessage: nextConversation.messages.at(-1)?.body || "",
          lastMessageAt: nextConversation.messages.at(-1)?.createdAt || new Date().toISOString(),
          unreadCount: 0,
        };
        const remaining = current.filter((item) => item.user.id !== nextConversation.user.id);
        return [nextItem, ...remaining];
      });
      setMessageBody("");
      showToast({ type: "message", message: `Your message reached ${nextConversation.user.name}.` });
    } finally {
      setIsSending(false);
    }
  }

  function openConversation(userId) {
    setSearchParams({ userId });
  }

  return (
    <main className="mx-auto max-w-[96rem] px-4 py-8 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#08111d] shadow-[0_28px_90px_rgba(2,6,23,0.42)]">
        <div className="grid min-h-[78vh] lg:grid-cols-[24rem_minmax(0,1fr)]">
          <aside className="border-b border-white/8 bg-[#0b121b] lg:border-b-0 lg:border-r">
            <div className="border-b border-white/8 px-5 py-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xl font-semibold text-white">{user?.name || "Messages"}</p>
                  <p className="mt-1 text-sm text-white/45">Private travel conversations</p>
                </div>
                <button type="button" className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5 text-white/75">
                  <DotsIcon />
                </button>
              </div>

              <div className="relative mt-5">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/34">
                  <SearchIcon />
                </span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search messages"
                  className="w-full rounded-full border border-white/10 bg-white/6 py-3 pl-12 pr-4 text-white outline-none placeholder:text-white/28"
                />
              </div>
            </div>

            <div className="max-h-[calc(78vh-8.5rem)] overflow-y-auto">
              {isInboxLoading ? <p className="px-5 py-6 text-sm text-white/45">Loading inbox...</p> : null}
              {!isInboxLoading && !filteredInbox.length ? <p className="px-5 py-6 text-sm text-white/45">No conversations yet. Start from a profile message button.</p> : null}

              {filteredInbox.map((item) => {
                const isActive = item.user.id === selectedUserId;
                return (
                  <button
                    key={item.user.id}
                    type="button"
                    onClick={() => openConversation(item.user.id)}
                    className={`flex w-full items-center gap-3 border-b border-white/6 px-5 py-4 text-left transition ${isActive ? "bg-white/10" : "hover:bg-white/[0.04]"}`}
                  >
                    <img
                      src={item.user.avatarUrl || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=320&q=80"}
                      alt={item.user.name}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-base font-semibold text-white">{item.user.name}</p>
                        <span className="text-xs text-white/35">{formatConversationTime(item.lastMessageAt)}</span>
                      </div>
                      <p className="mt-1 truncate text-sm text-white/45">{item.lastMessage || item.user.location || "Start a conversation"}</p>
                    </div>
                    {item.unreadCount ? (
                      <span className="grid h-6 min-w-[1.5rem] place-items-center rounded-full bg-[var(--aqua)] px-2 text-xs font-semibold text-slate-950">
                        {item.unreadCount}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="flex min-h-[78vh] flex-col bg-[#0a1018]">
            {conversation ? (
              <>
                <div className="border-b border-white/8 px-5 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={conversation.user.avatarUrl || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=320&q=80"}
                        alt={conversation.user.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-white">{conversation.user.name}</p>
                        <p className="text-sm text-white/42">{conversation.user.location || conversation.user.bio || "Bondly traveler"}</p>
                      </div>
                    </div>
                    <Link
                      to={`/users/${conversation.user.id}`}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white"
                    >
                      View profile
                    </Link>
                  </div>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto bg-[radial-gradient(circle_at_top,rgba(94,234,212,0.08),transparent_16%),linear-gradient(180deg,#0a1018_0%,#090f17_100%)] px-5 py-6">
                  {isConversationLoading ? <p className="text-sm text-white/45">Loading conversation...</p> : null}
                  {!isConversationLoading && !conversation.messages.length ? (
                    <div className="mx-auto max-w-md rounded-[1.6rem] border border-white/10 bg-white/[0.03] px-5 py-6 text-center text-sm text-white/45">
                      This thread is empty. Say hello and start planning something memorable.
                    </div>
                  ) : null}

                  {conversation.messages.map((item) => {
                    const isOwn = item.senderId === user?.id;

                    return (
                      <div key={item.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[42rem] ${isOwn ? "items-end" : "items-start"} flex gap-3`}>
                          {!isOwn ? (
                            <img
                              src={conversation.user.avatarUrl || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=320&q=80"}
                              alt={conversation.user.name}
                              className="mt-1 h-8 w-8 rounded-full object-cover"
                            />
                          ) : null}
                          <div className={`rounded-[1.75rem] px-5 py-4 text-sm leading-7 ${isOwn ? "bg-[linear-gradient(135deg,#2de2c4,#7dd3fc)] text-slate-950" : "bg-white/[0.06] text-white"}`}>
                            <p>{item.body}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={handleSendMessage} className="border-t border-white/8 px-5 py-4">
                  <div className="flex items-center gap-3 rounded-full border border-white/10 bg-[#0a111b] p-2 pl-3">
                    <input
                      value={messageBody}
                      onChange={(event) => setMessageBody(event.target.value)}
                      placeholder={`Message ${conversation.user.name}...`}
                      className={`${composerClass} border-none bg-transparent px-3 py-2`}
                    />
                    <button
                      type="submit"
                      disabled={isSending}
                      className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950"
                    >
                      {isSending ? "Sending..." : "Send"}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="grid flex-1 place-items-center px-6 text-center">
                <div className="max-w-lg">
                  <div className="mx-auto grid h-20 w-20 place-items-center rounded-[2rem] border border-white/10 bg-white/5 text-white/80">
                    <DotsIcon />
                  </div>
                  <h1 className="mt-6 text-3xl font-semibold text-white">Your message space is ready</h1>
                  <p className="mt-3 text-sm leading-7 text-white/45">
                    Pick a conversation from the left, or open a traveler profile and tap Message to start a new thread.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

function formatConversationTime(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) {
    const diffMinutes = Math.max(1, Math.floor(diffMs / (1000 * 60)));
    return `${diffMinutes}m`;
  }

  if (diffHours < 24) {
    return `${diffHours}h`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays}d`;
  }

  return date.toLocaleDateString();
}
