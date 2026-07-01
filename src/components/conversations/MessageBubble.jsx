import { formatTime } from "../../utils/formatters"
 
export default function MessageBubble({ message }) {
  const isUser = message.role === "user"
 
  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
      <span className="text-[10px] font-semibold text-white/25 uppercase tracking-wide mb-1.5">
        {isUser ? "Cliente" : "GiBi"}
      </span>
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? "bg-gb-500 text-white rounded-tr-sm"
            : "bg-white/[0.04] text-white/80 border border-white/[0.06] rounded-tl-sm"
        }`}
      >
        {message.content}
      </div>
      <span className="text-[10px] text-white/25 mt-1">{formatTime(message.created_at)}</span>
    </div>
  )
}