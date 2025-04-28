import DarkMode from "../components/DarkMode";
import React, { useState } from "react";
import axios from "axios";
import CreateReportModal from "../components/CreateReportModal";
import "../components/Settings.css";

const Settings = ({ close }) => {
  const token = localStorage.getItem("token");
  const API   = import.meta.env.VITE_API_BASE_URL;

  const [name, setName] = useState("");
  const [curPass, setCurPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState("name"); // name | pass | delete
  const headers = { Authorization: `Bearer ${token}` };

  const toast = (msg)=>alert(msg);               
  const reset = ()=>{ setName(""); setCurPass(""); setNewPass(""); };

  const handleName = async (e)=>{
    e.preventDefault();
    try{
      setBusy(true);
      const {data} = await axios.patch(`${API}/api/user/name`,{name}, {headers});
      localStorage.setItem("user", JSON.stringify({name:data.name}));
      toast("Name updated"); reset(); close();
    }catch(e){ toast(e.response?.data?.error || "Error"); } finally{ setBusy(false); }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (newPass.length < 6) return toast('Use at least 6 chars');
  
    try {
      setBusy(true);
      await axios.patch(
        `${API}/api/user/password`,
        { current: curPass, next: newPass },
        { headers }
      );
      toast('Password changed');
      reset();
      close();
    } catch (e) {
      toast(e.response?.data?.error || 'Error');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async ()=>{
    if(!window.confirm("Delete account forever?")) return;
    try{
      setBusy(true);
      await axios.delete(`${API}/api/user`, {headers});
      localStorage.clear();
      window.location.href = "/"; // boot to landing
    }catch(e){ toast(e.response?.data?.error || "Error"); } finally{ setBusy(false); }
  };

  /* --- UI --- */
  return (
    <CreateReportModal isOpen onClose={close}>
      <h2>Account Settings</h2>

      <DarkMode/>
      <div className="set-tabs">
        <button onClick={()=>setTab("name")}   className={tab==="name"   ? "active":""}>Change&nbsp;Name</button>
        <button onClick={()=>setTab("pw")}     className={tab==="pw"     ? "active":""}>Change&nbsp;Password</button>
        <button onClick={()=>setTab("delete")} className={tab==="delete" ? "active":""}>Delete&nbsp;Acct</button>
      </div>

      {tab==="name" && (
        <form onSubmit={handleName} className="set-form">
          <label>New display name
            <input value={name} onChange={e=>setName(e.target.value)} required />
          </label>
          <button disabled={busy}>Save</button>
        </form>
      )}

      {tab==="pw" && (
        <form onSubmit={handlePassword} className="set-form">
          <label>Current password
            <input type="password" value={curPass} onChange={e=>setCurPass(e.target.value)} required />
          </label>
          <label>New password
            <input type="password" value={newPass} onChange={e=>setNewPass(e.target.value)} required />
          </label>
          <button disabled={busy}>Change Password</button>
        </form>
      )}

      {tab==="delete" && (
        <div style={{marginTop:"1rem"}}>
          <p style={{color:"crimson"}}>This cannot be undone.</p>
          <button className="danger" onClick={handleDelete} disabled={busy}>Delete my account</button>
        </div>
      )}
    </CreateReportModal>
  );
};

export default Settings;
