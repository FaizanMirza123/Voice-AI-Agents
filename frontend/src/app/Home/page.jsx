"use client";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function page() {
  const [data, setData] = useState([]);
  const [logsRaw, setLogsRaw] = useState({});
  const [openLog, setOpenLog] = useState(null);
  let api = "http://localhost:8000"; // Replace with your actual API endpoint during deployment
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    } else if (token) {
      const decode = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decode.exp < now) {
        localStorage.removeItem("token");
        router.push("/");
      } else {
        axios
          .get(`${api}/`)
          .then((res) => {
            setData(res.data);
            // Handle the response data as needed
          })
          .catch((err) => { 
            console.error("Error fetching data:", err);
            // Handle the error as needed
          });
      }
    }
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${api}/messages`);
      setLogsRaw(res.data);
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
  };

  // Memoize processed logs for chat display
  const logs = useMemo(() => {
    const formatted = {};
    for (const [name, chats] of Object.entries(logsRaw)) {
      // Flatten all chat arrays into one, sort by time
      const allMsgs = chats
        .flat()
        .sort((a, b) => (a.time || 0) - (b.time || 0));
      formatted[name] = allMsgs;
    }
    return formatted;
  }, [logsRaw]);

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-r from-pink-200 via-pink-400 to-purple-500 p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Voice AI Assistants
        </h1>
        <div className="flex flex-wrap gap-8 justify-center">
          {data.map((item, idx) => (
            <div
              key={(() => {
                if (item.id) {
                  return item.id;
                } else {
                  return idx;
                }
              })()}
              className="flex-1 min-w-[300px] max-w-sm bg-white bg-opacity-90 p-6 rounded-2xl shadow-lg m-2 flex flex-col justify-between"
              style={{ flexBasis: "30%", alignSelf: "flex-start" }}
            >
              <h2 className="text-xl font-bold mb-2 text-pink-600">
                {item.name}
              </h2>
              <div className="mb-2 text-black">
                <span className="font-semibold">Voice ID:</span>{" "}
                {(() => {
                  if (item.voice && item.voice.voiceId) {
                    return item.voice.voiceId;
                  } else {
                    return "N/A";
                  }
                })()}
              </div>
              <button
                className="mt-2 px-3 py-1 bg-pink-500 text-white rounded hover:bg-pink-600"
                onClick={() => {
                  if (!logsRaw[item.name]) fetchLogs();
                  if (openLog === item.name) {
                    setOpenLog(null);
                  } else {
                    setOpenLog(item.name);
                  }
                }}
              >
                {(() => {
                  if (openLog === item.name) {
                    return "Hide";
                  } else {
                    return "Show";
                  }
                })()}{" "}
                Chat Log
              </button>
              {(() => {
                if (openLog === item.name && logs[item.name]) {
                  // Find the call for this assistant with the latest startedAt/endedAt
                  let startedAt = null;
                  let endedAt = null;
                  if (logsRaw[item.name] && logsRaw[item.name].length > 0) {
                    // Find the latest call (by endedAt or startedAt)
                    let latestCall = null;
                    for (let i = 0; i < logsRaw[item.name].length; i++) {
                      const call = logsRaw[item.name][i];
                      if (
                        !latestCall ||
                        (call.endedAt && call.endedAt > latestCall.endedAt)
                      ) {
                        latestCall = call;
                      }
                    }
                    if (latestCall) {
                      startedAt = latestCall.startedAt;
                      endedAt = latestCall.endedAt;
                    }
                  }
                  return (
                    <div className="mt-3 bg-white rounded p-2 max-h-60 overflow-y-auto text-xs border border-gray-300 shadow-inner w-full">
                      {(() => {
                        if (startedAt || endedAt) {
                          return (
                            <div className="mb-2 text-gray-500 text-xs">
                              {startedAt && <div>Started: {startedAt}</div>}
                              {endedAt && <div>Ended: {endedAt}</div>}
                            </div>
                          );
                        }
                      })()}
                      {(() => {
                        if (logs[item.name].length === 0) {
                          return <div>No logs found.</div>;
                        } else {
                          return logs[item.name].map((msg, j) => {
                            let alignClass = "flex mb-2 justify-start";
                            let bubbleClass =
                              "px-3 py-2 rounded-lg max-w-[80%] bg-gray-200 text-gray-800 self-start";
                            let label = msg.role;
                            if (msg.role === "user") {
                              alignClass = "flex mb-2 justify-end";
                              bubbleClass =
                                "px-3 py-2 rounded-lg max-w-[80%] bg-pink-400 text-white self-end";
                              label = "You";
                            } else if (msg.role === "assistant") {
                              label = "Assistant";
                            } else if (msg.role === "bot") {
                              label = "Assistant";
                            }
                            return (
                              <div key={j} className={alignClass}>
                                <div className={bubbleClass}>
                                  <span className="block font-semibold mb-1 capitalize">
                                    {label}
                                  </span>
                                  <span>{msg.message}</span>
                                </div>
                              </div>
                            );
                          });
                        }
                      })()}
                    </div>
                  );
                }
              })()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
