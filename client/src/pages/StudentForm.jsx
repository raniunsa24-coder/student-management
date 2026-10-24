import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api, { errMsg } from '../api';
import Field from '../components/Field';
import PageLoader from '../components/PageLoader';

const empty = { name: '', rollNo: '', email: '', phone: '', course: '', gender: 'Male', age: '', address: '' };

export default function StudentForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(editing);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!editing) return;
    api
      .get(`/students/${id}`)
      .then((r) => {
        const s = r.data;
        setForm({ ...empty, ...s, age: s.age ?? '' });
      })
      .catch((e) => setServerError(errMsg(e)))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 3) e.name = 'Name must be at least 3 characters';
    if (!form.rollNo.trim()) e.rollNo = 'Roll number is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address';
    if (!/^\d{10,15}$/.test(form.phone.replace(/[\s-]/g, ''))) e.phone = 'Phone must be 10 to 15 digits';
    if (!form.course.trim()) e.course = 'Course is required';
    if (form.age !== '' && (Number(form.age) < 15 || Number(form.age) > 60)) e.age = 'Age must be between 15 and 60';
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    setServerError('');
    try {
      if (editing) await api.put(`/students/${id}`, form);
      else await api.post('/students', form);
      navigate('/students');
    } catch (err) {
      setServerError(errMsg(err));
      setBusy(false);
    }
  };

  if (loading) return <PageLoader label="Loading student…" />;

  return (
    <>
      <header className="page-head">
        <div>
          <h1>{editing ? 'Edit student' : 'Add student'}</h1>
          <p className="muted">{editing ? 'Update the details below.' : 'Fill in the details to register a new student.'}</p>
        </div>
      </header>

      <form className="panel form-grid" onSubmit={submit} noValidate>
        {serverError && <div className="alert span-2">{serverError}</div>}
        <Field label="Full name" error={errors.name}><input value={form.name} onChange={set('name')} /></Field>
        <Field label="Roll number" error={errors.rollNo}><input value={form.rollNo} onChange={set('rollNo')} /></Field>
        <Field label="Email" error={errors.email}><input type="email" value={form.email} onChange={set('email')} /></Field>
        <Field label="Phone" error={errors.phone}><input value={form.phone} onChange={set('phone')} inputMode="tel" /></Field>
        <Field label="Course" error={errors.course}><input value={form.course} onChange={set('course')} /></Field>
        <Field label="Age" error={errors.age}><input type="number" value={form.age} onChange={set('age')} /></Field>
        <Field label="Gender">
          <select value={form.gender} onChange={set('gender')}>
            <option>Male</option><option>Female</option><option>Other</option>
          </select>
        </Field>
        <Field label="Address"><input value={form.address} onChange={set('address')} /></Field>
        <div className="form-actions span-2">
          <Link to="/students" className="btn btn-ghost">Cancel</Link>
          <button className="btn btn-primary" disabled={busy}>
            {busy && <span className="spinner spinner-sm" />} {busy ? 'Saving…' : editing ? 'Save changes' : 'Add student'}
          </button>
        </div>
      </form>
    </>
  );
}
