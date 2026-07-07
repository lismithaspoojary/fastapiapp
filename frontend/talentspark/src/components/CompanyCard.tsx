import { useState } from "react";
import type { Company, CompanyCreatePayload } from "../types/company";
import "./CompanyCard.css";

type Props = {
    companies: Company[];
    onedit: (company: Company) => Promise<void>;
    ondelete: (id: number) => Promise<void>;
    onadd: (company: CompanyCreatePayload) => Promise<void>;
};

function CompanyCard({ companies, onedit, ondelete, onadd }: Props) {
    const [editCompanyId, setEditCompanyId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Company>({
        id: 0,
        name: "",
        email: "",
        phone: "",
        location: "",
        jobs: [],
    });
    const [addForm, setAddForm] = useState<Company>({
        id: 0,
        name: "",
        email: "",
        phone: "",
        location: "",
        jobs: [],
    });

    const handleAdd = async () => {
        await onadd({
            name: addForm.name,
            email: addForm.email,
            phone: addForm.phone,
            location: addForm.location,
        });
        setAddForm({ id: 0, name: "", email: "", phone: "", location: "", jobs: [] });
    };

    const handleSave = () => {
        if (editCompanyId !== null) {
            onedit(editForm);
            setEditCompanyId(null);
            setEditForm({ id: 0, name: "", email: "", phone: "", location: "", jobs: [] });
        }
    };

    const handleCancel = () => {
        setEditCompanyId(null);
        setEditForm({ id: 0, name: "", email: "", phone: "", location: "", jobs: [] });
    };

    return (
        <div className="company-card-list">
            {companies.map((company) => (
                <div
                    key={company.id}
                    className={`company-card ${((company.email || "").toLowerCase() === "l@gmail.com" || (company.name || "").toLowerCase().includes("lseg")) ? 'muted-card' : ''}`}>
                    {editCompanyId === company.id ? (
                        <div className="company-edit-form">
                            <input
                                type="text"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                placeholder="Company name"
                                className="form-input"
                            />
                            <input
                                type="email"
                                value={editForm.email}
                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                placeholder="Company email"
                                className="form-input"
                            />
                            <input
                                type="tel"
                                value={editForm.phone}
                                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                placeholder="Company phone"
                                className="form-input"
                            />
                            <input
                                type="text"
                                value={editForm.location}
                                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                placeholder="Company location"
                                className="form-input"
                            />
                            <div className="company-card-actions">
                                <button onClick={handleSave} className="btn btn-primary btn-sm">Save</button>
                                <button onClick={handleCancel} className="btn btn-secondary btn-sm">Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h3 className="company-name">{company.name}</h3>
                            <p>{company.email}</p>
                            <p>{company.phone}</p>
                            <p>{company.location}</p>
                            <div className="company-card-actions">
                                <button
                                    onClick={() => {
                                        setEditCompanyId(company.id);
                                        setEditForm(company);
                                    }}
                                    className="btn btn-secondary btn-sm"
                                >Edit</button>
                                <button onClick={() => ondelete(company.id)} className="btn btn-danger btn-sm">Delete</button>
                            </div>
                        </>
                    )}
                </div>
            ))}

            <div className="company-card new-company-card">
                <h3>Add Company</h3>
                <input
                    type="text"
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                    placeholder="Company name"
                    className="form-input"
                />
                <input
                    type="email"
                    value={addForm.email}
                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                    placeholder="Email"
                    className="form-input"
                />
                <input
                    type="tel"
                    value={addForm.phone}
                    onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                    placeholder="Phone"
                    className="form-input"
                />
                <input
                    type="text"
                    value={addForm.location}
                    onChange={(e) => setAddForm({ ...addForm, location: e.target.value })}
                    placeholder="Location"
                    className="form-input"
                />
                <button onClick={handleAdd} className="btn btn-primary">Add Company</button>
            </div>
        </div>
    );
}

export default CompanyCard;