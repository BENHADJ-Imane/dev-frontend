import { useState, useEffect } from 'react';
import api from '../api/axios';
import axios from 'axios';

interface Project {
  id: string;
  name: string;
  color: string;
}

interface Column {
  id: string;
  title: string;
  tasks: string[];
}

export default function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projRes, colRes] = await Promise.all([
          api.get('/projects'),
          api.get('/columns'),
        ]);
        setProjects(projRes.data);
        setColumns(colRes.data);
      } catch {
        setError('Erreur chargement');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function addProject(name: string, color: string) {
    try {
      const { data } = await api.post('/projects', { name, color });
      setProjects(prev => [...prev, data]);
    } catch (err) {
      if (axios.isAxiosError(err)) setError(`Erreur: ${err.response?.status}`);
    }
  }

  async function renameProject(project: Project) {
    const newName = prompt('Nouveau nom :', project.name);
    if (!newName) return;

    const { data } = await api.put(`/projects/${project.id}`, {
      ...project,
      name: newName,
    });

    setProjects(prev => prev.map(p => (p.id === data.id ? data : p)));
  }

  async function deleteProject(id: string) {
    await api.delete(`/projects/${id}`);
    setProjects(prev => prev.filter(p => p.id !== id));
  }

  return { projects, columns, loading, error, addProject, renameProject, deleteProject };
}