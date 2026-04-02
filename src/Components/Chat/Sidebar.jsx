import { motion } from "framer-motion"
import { ArrowDown01, ChevronDown, ChevronRight, Folder, LoaderPinwheelIcon, MoreVerticalIcon, Plus, Search, Table } from "lucide-react"
import { useRef, useState, useEffect } from "react"

export default function Sidebar({ setSidebarOpen }) {

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.chatmore-trigger') && !event.target.closest('.chatmore-menu')) {
        setChatMore(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [projects, setProjects] = useState([
    {
      "id": 1,
      "name": "project1",
    },
    {
      "id": 2,
      "name": "project2",
    },
    {
      "id": 3,
      "name": "project3",
    },
    {
      "id": 4,
      "name": "project4",
    },
    {
      "id": 5,
      "name": "project5",
    },
  ])

  const [chats, setChats] = useState([
    {
      "id": 1,
      "name": "chat1",
    },
    {
      "id": 2,
      "name": "chat2",
    },
    {
      "id": 3,
      "name": "chat3",
    },
    {
      "id": 4,
      "name": "chat4",
    },
    {
      "id": 5,
      "name": "chat5",
    },
  ])

  function ProjectMoreModel() {
    return (
      <div className="bg-gray-800 text-sm text-gray-200 p-1.5 rounded-md shadow-lg border border-gray-600 w-28 flex flex-col gap-1 chatmore-menu">
        <div className="hover:bg-gray-600 px-2 py-1.5 rounded cursor-pointer">Rename</div>
        <div className="hover:bg-gray-600 px-2 py-1.5 rounded cursor-pointer text-red-400">Delete</div>
      </div>
    )
  }

  function ChatMoreModel(){
    return(
      <div className="bg-gray-800 text-sm text-gray-200 p-1.5 rounded-md shadow-lg border border-gray-600 w-28 flex flex-col gap-1 chatmore-menu">
        <div className="hover:bg-gray-600 px-2 py-1.5 rounded cursor-pointer">Rename</div>
        <div className="hover:bg-gray-600 px-2 py-1.5 rounded cursor-pointer text-red-400">Delete</div>
      </div>
    )
  }


  const [projectOpen, setProjectOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [moreModel, setMoreModel] = useState(false)
  const [chatMore, setChatMore] = useState(null)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      exit={{ opacity: 0 }}
      className="text-white flex-col gap-4 flex"
    >
      <div className="mx-5"
        onClick={() => setSidebarOpen(false)}

      >
        <LoaderPinwheelIcon />
      </div>

      <div className="mx-5">
        <div
          className="flex flex-col items-start cursor-pointer gap-2.5 w-full"
        >
          <div className="flex justify-start items-center gap-2.5 hover:bg-gray-600 w-full py-1 px-3 rounded-full">
            <Plus />
            new chat
          </div>

          <div className="flex items-center justify-start cursor-pointer gap-2.5 hover:bg-gray-600 w-full py-1 px-3 rounded-full">
            <Search size={20} />
            Search chat
          </div>
        </div>

      </div>

      <div className="border-b border-gray-600 pb-3">
        <div

          onClick={() => setProjectOpen(!projectOpen)}
          className="flex text-[13px] text-gray-200 text-center items-center cursor-pointer gap-3 mx-5 ">
          Your Projects <span>{projectOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}</span>
        </div>
        <div className={`${projectOpen ? "block" : "hidden"} mt-2 `} >
          {
            projects.map((project, index) => {
              return (
                <div

                  className="flex justify-between relative items-center cursor-pointer hover:bg-gray-600 w-full py-1 px-3 rounded-full">
                  <div className="flex text-sm items-center gap-2.5 flex-1 min-w-0">
                    <div className="shrink-0">
                      <Folder size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <input
                        className="outline-0 bg-transparent w-full truncate cursor-text"
                        type="text"
                        value={project.name} />
                    </div>
                  </div>
                  <div
                    className="chatmore-trigger z-10 p-1 hover:bg-gray-500 rounded-md shrink-0 ml-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setChatMore(project.id === chatMore ? null : project.id);
                    }}
                  >
                    <MoreVerticalIcon size={20} />
                  </div>
                  <div className="absolute top-2 -right-25 z-50">
                    {chatMore === project.id &&
                      <ProjectMoreModel />
                    }
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>

      <div>
        <div
          onClick={() => setChatOpen(!chatOpen)}
          className="flex text-[13px] text-gray-200 text-center items-center cursor-pointer gap-3 mx-5 ">
          Your Chats <span>{chatOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}</span>
        </div>

        <div className={` ${chatOpen ? "block" : "hidden"} mt-2`}>
          {
            chats.map((chat, index) => {
              return (
                <div
                  key = {chat.id}
                  className="flex justify-between relative items-center cursor-pointer hover:bg-gray-600 w-full py-1 px-3 rounded-full">
                  <div className="flex text-sm items-center gap-2.5 flex-1 min-w-0">
                    <div className="shrink-0">
                      <Folder size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <input
                        className="outline-0 bg-transparent w-full truncate cursor-text"
                        type="text"
                        value={chat.name} />
                    </div>
                  </div>
                  <div
                    className="chatmore-trigger z-10 p-1 hover:bg-gray-500 rounded-md shrink-0 ml-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setChatMore(chat.id === chatMore ? null : chat.id);
                    }}
                  >
                    <MoreVerticalIcon size={20} />
                  </div>
                  <div className="absolute top-2 -right-25 z-50">
                    {chatMore === chat.id &&
                      <ChatMoreModel />
                    }
                  </div>
                </div>
              )
            })
          }

        </div>
      </div>
    </motion.div>
  )
}