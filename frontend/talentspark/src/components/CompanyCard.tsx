import type {Company} from "../types/company";
import {useState} from "react";

type Props = {
    companies:Company[];
    onedit: (company:Company)=>void;
    ondelete: (id:number)=>void;
    onadd: (company:Company)=>void;
}


function CompanyCard({
    companies,onadd,onedit,ondelete}:Props){
    const [editCompanyId, setEditCompanyId] = useState<number | null>(null);
    const [addform,setAddform] = useState<Company>({
        id:0,
        name:"",
        email:"",
        phone:"",
        location:"",
        jobs:[]
    });
    const [editform,setEditform] = useState<Company>({
        id:0,
        name:"",
        email:"",
        phone:"",
        location:"",
        jobs:[]
    });
    const handleAdd = () => {
        onadd(addform);
        setAddform({
            id:0,
            name:"",
            email:"",
            phone:"",
            location:"",
            jobs:[]
        })
    }
    const handleSave = () => {
        onedit(editform);
        setEditCompanyId(null);
        setEditform({
            id:0,
            name:"",
            email:"",
            phone:"",
            location:"",
            jobs:[]
        })
    } 
    const handlecancel = () => {
        setEditCompanyId(null);
        setEditform({
            id:0,
            name:"",
            email:"",
            phone:"",
            location:"",
            jobs:[]
        })
    } 

    return(
        <div style={{ display: "grid", gap: 12 }}>
            {companies.map((company) => (
                <div key={company.id} style={{ padding: 16, border: "1px solid #e2e8f0", borderRadius: 12, background: "#f8fafc" }}>
                    {editCompanyId === company.id ? (
                        <>
                    <input type="text" value={editform.name} onChange={(e)=>setEditform({...editform,name:e.target.value})} placeholder={company.name} />
                    <input type="text" value={editform.email} onChange={(e)=>setEditform({...editform,email:e.target.value})} placeholder={company.email} />
                    <input type="text" value={editform.phone} onChange={(e)=>setEditform({...editform,phone:e.target.value})} placeholder={company.phone} />
                    <input type="text" value={editform.location} onChange={(e)=>setEditform({...editform,location:e.target.value})} placeholder={company.location} />
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handlecancel}>Cancel</button>
                    </>
                    ):
                    <>
                    <h1 style={{ color: "#111827", margin: 0 }}>{company.name}</h1>
                    <p style={{ color: "#1f2937", margin: "6px 0 0" }}>Email: {company.email}</p>
                    <p style={{ color: "#1f2937", margin: "4px 0 0" }}>Phone: {company.phone}</p>
                    <p style={{ color: "#1f2937", margin: "4px 0 0" }}>Location: {company.location}</p>
                    </>}
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <button onClick={() => setEditCompanyId(company.id)} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer" }}>Edit</button>
                      <button onClick={() => ondelete(company.id)} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer" }}>Delete</button>
                    </div>
                </div>
            ))}
            <h2>Add Company</h2>
            <input type="text" value={addform.name} onChange={(e)=>setAddform({...addform,name:e.target.value})} />
            <input type="text" value={addform.email} onChange={(e)=>setAddform({...addform,email:e.target.value})} />
            <input type="text" value={addform.phone} onChange={(e)=>setAddform({...addform,phone:e.target.value})} />
            <input type="text" value={addform.location} onChange={(e)=>setAddform({...addform,location:e.target.value})} />
            <button onClick={handleAdd}>Add</button>
        </div>
    )
}

export default CompanyCard