// import { useRef } from "react";

// import classes from "./CreateIssue.module.css";
// import Modal from "../modal/Modal";
// import Tag from "../tag/Tag";
// import Button from "../button/Button";

// // for now starts with 5 because theres 4 dummy issues
// let idNumber = 6;
// // probably canceled at all
// // for now the id is local have to check if it wont restart every load

// // gets props from projectOverview

// const CreateIssue = (props) => {
//   // later this list should be passed via props
//   const participantsNames = [
//     "none@gmail.com",
//     "velvel@gmail.com",
//     "mike@gmail.com",
//     "josh@gmail.com",
//   ];
//   const priorities = ["none", "epic", "high", "low"];

//   const descriptionRef = useRef();
//   const assigneeRef = useRef();
//   const priortyRef = useRef();

//   const taskInput_obj = {
//     text: "",
//     email: "",
//     priority: "",
//     status: "to do",
//     task_id: idNumber + 1,
//     project_id: 1,
//   };

//   const onCloseModalHandler = () => {
//     props.onCloseModal();
//   };

//   const onSubmitHandler = (event) => {
//     event.preventDefault();
//     idNumber++;
//     taskInput_obj.text = descriptionRef.current.value;
//     taskInput_obj.email = assigneeRef.current.value;
//     taskInput_obj.priority = priortyRef.current.value;

//     props.onCreateIssue(taskInput_obj);
//     props.onCloseModal();
//   };

//   return (
//     <Modal>
//       <form onSubmit={onSubmitHandler} className={classes.issueForm}>
//         <label>
//           Description:
//           <input
//             type="text"
//             // value={props.descValue ? props.descValue : ""}
//             name="description"
//             placeholder="Write a task"
//             ref={descriptionRef}
//           />
//         </label>
//         <div className={classes.bottomHalf}>
//           <Tag innerTag={idNumber + 1} />
//           <label>
//             Assign to:
//             <select name="assignee" id="" ref={assigneeRef}>
//               {participantsNames.map((name) => {
//                 return (
//                   <option key={Math.random()} value={name}>
//                     {name}
//                   </option>
//                 );
//               })}
//             </select>
//           </label>
//           <div className={classes.tags}>
//             <label>
//               prority:
//               <select name="prority" id="" ref={priortyRef}>
//                 {priorities.map((priority) => {
//                   return (
//                     <option key={Math.random()} value={priority}>
//                       {priority}
//                     </option>
//                   );
//                 })}
//               </select>
//             </label>
//           </div>
//         </div>
//         <div className={classes.btns}>
//           <Button type="submit">Create issue</Button>
//           <Button onClick={onCloseModalHandler}>Cancel</Button>
//         </div>
//       </form>
//     </Modal>
//   );
// };

// export default CreateIssue;
