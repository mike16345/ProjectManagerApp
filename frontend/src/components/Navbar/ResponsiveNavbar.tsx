// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import ProfileModal from "../Profile/ProfileModal";
// import SearchBar from "./SearchBar";
// import { When } from "react-if";
// import { useProjectsStore } from "../../store/projectsStore";
// import { useUsersStore } from "../../store/usersStore";
// import { useToast } from "../ui/use-toast";

// const Navbar: React.FC = () => {
//   const { activeProject, projects, setActiveProject } = useProjectsStore();
//   const { activeUser } = useUsersStore();

//   const { toast } = useToast();
//   const navigate = useNavigate();

//   const [openMenu, setOpenMenu] = useState(false);
//   const onLogoClickHandler = () => {
//     if (activeProject?._id) {
//       navigate("/home");
//     }
//   };

//   const onSearchHandler = async (inputValue: string) => {
//     const currentFound = projects.find(
//       (project) => project.name.toLowerCase() === inputValue.toLowerCase()
//     );

//     if (currentFound) {
//       setActiveProject(currentFound);
//       navigate("/project_overview");
//     } else {
//       toast({
//         title: "Project not found",
//         description: "Could not find project with that name",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <nav className=" bg-secondary text-primary z-10 sticky top-0 py-2 px-2 ">
//       <div
//         className=" md:text-3xl text-xl items-center justify-between  flex cursor-pointer font-bold "
//         onClick={onLogoClickHandler}
//       >
//         <span className="text-muted-foreground ">Synergize</span>
//         <svg
//           onClick={() => setOpenMenu((open) => !open)}
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 24 24"
//           strokeWidth={1.5}
//           stroke="currentColor"
//           className="w-6 h-6 cursor-pointer md:hidden"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
//           />
//         </svg>
//       </div>
//       <ul
//         className={`${
//           !openMenu && "hidden"
//         } flex flex-col gap-1 md:flex-row md:items-center`}
//       >
//         <li>
//           <Link
//             to={"/"}
//             className=" font-extrabold md:hover:scale-105 flex justify-between"
//           >
//             Home
//           </Link>
//         </li>
//         <li>
//           <Link
//             to={"/project_overview"}
//             className=" font-extrabold md:hover:scale-105"
//           >
//             Project Overview
//           </Link>
//         </li>
//         <li>
//           <Link to={"/myTasks"} className="  font-extrabold md:hover:scale-105">
//             My Tasks
//           </Link>
//         </li>
//         <li>
//           <Link
//             to={"/allProjects"}
//             className="  font-extrabold md:hover:scale-105"
//           >
//             Projects
//           </Link>
//         </li>
//         <When condition={activeUser?.isAdmin}>
//           <li>
//             <Link
//               to={"/admin"}
//               className="  font-extrabold md:hover:scale-105"
//               onClick={onLogoClickHandler}
//             >
//               Admin
//             </Link>
//           </li>
//         </When>
//         <li className="md:block hidden">
//           <SearchBar onInput={onSearchHandler} />
//         </li>
//         <li className="md:block hidden">
//           <ProfileModal />
//         </li>
//       </ul>
//     </nav>
//   );
// };

// export default Navbar;
