import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api, { errMsg } from '../api';
import { useAuth } from '../AuthContext';
import PageLoader from '../components/PageLoader';

export default function Students() {
  const { isAdmin } = useAuth();
  const [params, setParams] = useSearchParams();
  const search = params.get('search') || '';
  const page = parseInt(params.get('page')) || 1;

  const [input, setInput] = useState(search);
  const [data, setData] = useState({ students: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // Debounce the search box
  useEffect(() => {
    const t = setTimeout(() => {
      if (input !== search) setParams(input ? { search: input } : {});
    }, 350);
    return () => clearTimeout(t);
  }, [input]);

  const load = () => {
    setLoading(true);
    setError('');
    api
      .get('/students', { params: { search, page, limit: 8 } })
      .then((r) => setData(r.data))
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));
  };

  useEffect(load, [search, page]);

  const goTo = (p) => setParams({ ...(search ? { search } : {}), page: p });

  const remove = async (s) => {
    if (!window.confirm(`Delete ${s.name}? This cannot be undone.`)) return;
    setDeletingId(s._id);
    try {
      await api.delete(`/students/${s._id}`);
      if (data.students.length === 1 && page > 1) goTo(page - 1);
      else load();
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Students</h1>
          <p className="muted">{data.total} {data.total === 1 ? 'student' : 'students'}{search && ` matching “${search}”`}</p>
        </div>
        <Link to="/students/new" className="btn btn-primary">Add student</Link>
      </header>

      <div className="searchbar">
        <input placeholder="Search by name, roll number, email or course" value={input} onChange={(e) => setInput(e.target.value)} />
      </div>

      {error && <div className="alert">{error}</div>}

      <section className="panel">
        {loading ? (
          <PageLoader label="Loading students…" />
        ) : data.students.length === 0 ? (
          <p className="empty">{search ? 'No students match that search.' : 'No students yet.'}</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Name</th><th>Roll no.</th><th>Course</th><th>Email</th><th className="right">Actions</th></tr>
              </thead>
              <tbody>
                {data.students.map((s) => (
                  <tr key={s._id}>
                    <td data-label="Name"><Link to={`/students/${s._id}`}>{s.name}</Link></td>
                    <td data-label="Roll no.">{s.rollNo}</td>
                    <td data-label="Course">{s.course}</td>
                    <td data-label="Email">{s.email}</td>
                    <td className="right actions">
                      <Link to={`/students/${s._id}`} className="btn btn-ghost btn-sm">View</Link>
                      {isAdmin && (
                        <>
                          <Link to={`/students/${s._id}/edit`} className="btn btn-ghost btn-sm">Edit</Link>
                          <button className="btn btn-danger btn-sm" disabled={deletingId === s._id} onClick={() => remove(s)}>
                            {deletingId === s._id ? 'Deleting…' : 'Delete'}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {data.pages > 1 && (
        <nav className="pager" aria-label="Pagination">
          <button className="btn btn-ghost btn-sm" disabled={page <= 1} onClick={() => goTo(page - 1)}>Previous</button>
          <span>Page {page} of {data.pages}</span>
          <button className="btn btn-ghost btn-sm" disabled={page >= data.pages} onClick={() => goTo(page + 1)}>Next</button>
        </nav>
      )}
    </>
  );
}