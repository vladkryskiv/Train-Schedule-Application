import { useEffect, useMemo, useState } from 'react';
import type { SyntheticEvent } from 'react';
import {
  createTrain,
  deleteTrain,
  fetchTrains,
  updateTrain,
} from '../api/trainsApi';
import { SORT_FIELD_LABELS } from '../constants/sort.constants';
import type {
  TrainDto,
  SortableField,
  SortDirection,
} from '../types/train.types';

type FormMode = 'create' | 'edit';

function parseDateParts(value: string):
  | { y: string; m: string; d: string; h: string; min: string }
  | null {
  if (!value) return null;
  const match = value.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/,
  );
  if (!match) return null;
  const [, y, m, d, h, min] = match;
  return { y, m, d, h, min };
}

function formatDateTime(value: string): string {
  const parts = parseDateParts(value);
  if (!parts) return '';
  const { y, m, d, h, min } = parts;
  return `${d}.${m}.${y}, ${h}:${min}`;
}

function toInputDateTime(value: string): string {
  const parts = parseDateParts(value);
  if (!parts) return '';
  const { y, m, d, h, min } = parts;
  return `${y}-${m}-${d}T${h}:${min}`;
}

const EMPTY_FORM: Omit<TrainDto, 'id'> = {
  fromStation: '',
  toStation: '',
  departureTime: '',
  arrivalTime: '',
  price: 0,
  trainNumber: '',
};

interface TrainSchedulePageProps {
  token: string;
  onLogout: () => void;
}

export function TrainSchedulePage({ token, onLogout }: TrainSchedulePageProps) {
  const [trains, setTrains] = useState<TrainDto[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortableField>('departureTime');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [editableId, setEditableId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<TrainDto, 'id'>>(EMPTY_FORM);
  const [priceInput, setPriceInput] = useState<string>('');

  const loadTrains = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchTrains(token, {
        search: search.trim() || undefined,
        sortBy,
        sortDirection,
      });
      setTrains(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка мережі при завантаженні розкладу');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTrains();
  }, [sortBy, sortDirection]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setPriceInput('');
    setFormMode('create');
    setEditableId(null);
  };

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    try {
      const priceValue = priceInput === '' ? 0 : Number(priceInput);
      if (isNaN(priceValue) || priceValue < 0) {
        setError('Ціна повинна бути додатнім числом');
        return;
      }

      const formData = {
        ...form,
        price: priceValue,
      };

      if (formMode === 'create') {
        await createTrain(token, formData);
      } else if (editableId !== null) {
        await updateTrain(token, editableId, formData);
      }
      await loadTrains();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка мережі при збереженні поїзда');
    }
  };

  const handleDelete = async (id: number) => {
    setError(null);
    try {
      await deleteTrain(token, id);
      await loadTrains();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка мережі при видаленні поїзда');
    }
  };

  const handleEdit = (train: TrainDto) => {
    setForm({
      fromStation: train.fromStation,
      toStation: train.toStation,
      departureTime: toInputDateTime(train.departureTime),
      arrivalTime: toInputDateTime(train.arrivalTime),
      price: train.price,
      trainNumber: train.trainNumber,
    });
    setPriceInput(train.price === 0 ? '' : String(train.price));
    setFormMode('edit');
    setEditableId(train.id);
  };

  const handleSortClick = (field: SortableField) => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const sortFields = useMemo(
    () => Object.keys(SORT_FIELD_LABELS) as SortableField[],
    [],
  );

  return (
    <div className="page">
      <header className="page-header">
        <h1>Розклад поїздів</h1>
        <button className="secondary-button" onClick={onLogout} type="button">
          Вихід
        </button>
      </header>

      <section className="controls">
        <div className="search-sort">
          <input
            type="search"
            placeholder="Пошук за станціями або номером поїзда"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button
            className="secondary-button"
            onClick={loadTrains}
            type="button"
          >
            Шукати
          </button>
        </div>
        <div className="sort-buttons">
          <span>Сортувати:</span>
          {sortFields.map((field) => (
            <button
              key={field}
              type="button"
              className={
                sortBy === field ? 'secondary-button active' : 'secondary-button'
              }
              onClick={() => handleSortClick(field)}
            >
              {SORT_FIELD_LABELS[field]}
            </button>
          ))}
          <span className="sort-direction">
            {sortDirection === 'asc' ? '↑' : '↓'}
          </span>
        </div>
      </section>

      {error && <p className="alert error">{error}</p>}
      {isLoading && <p className="alert">Завантаження...</p>}

      <section className="layout">
        <div className="table-wrapper">
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Звідки</th>
                <th>Куди</th>
                <th>Відправлення</th>
                <th>Прибуття</th>
                <th className="th-number">Ціна</th>
                <th>Номер</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {trains.map((train) => (
                <tr key={train.id}>
                  <td className="cell-text">{train.fromStation}</td>
                  <td className="cell-text">{train.toStation}</td>
                  <td className="cell-datetime">
                    {formatDateTime(train.departureTime)}
                  </td>
                  <td className="cell-datetime">
                    {formatDateTime(train.arrivalTime)}
                  </td>
                  <td className="cell-number">{train.price}</td>
                  <td>{train.trainNumber}</td>
                  <td className="row-actions">
                    <button
                      className="secondary-button"
                      type="button"
                      onClick={() => handleEdit(train)}
                    >
                      Редагувати
                    </button>
                    <button
                      className="danger-button"
                      type="button"
                      onClick={() => handleDelete(train.id)}
                    >
                      Видалити
                    </button>
                  </td>
                </tr>
              ))}
              {trains.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={7} className="empty-state">
                    Немає поїздів. Додайте перший.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="form-panel">
          <h2>
            {formMode === 'create' ? 'Новий поїзд' : 'Редагування поїзда'}
          </h2>
          <form className="train-form" onSubmit={handleSubmit}>
            <label>
              <span>Звідки</span>
              <input
                type="text"
                value={form.fromStation}
                onChange={(event) =>
                  setForm({ ...form, fromStation: event.target.value })
                }
                required
              />
            </label>
            <label>
              <span>Куди</span>
              <input
                type="text"
                value={form.toStation}
                onChange={(event) =>
                  setForm({ ...form, toStation: event.target.value })
                }
                required
              />
            </label>
            <label>
              <span>Час відправлення</span>
              <input
                type="datetime-local"
                value={form.departureTime}
                onChange={(event) =>
                  setForm({ ...form, departureTime: event.target.value })
                }
                required
              />
            </label>
            <label>
              <span>Час прибуття</span>
              <input
                type="datetime-local"
                value={form.arrivalTime}
                onChange={(event) =>
                  setForm({ ...form, arrivalTime: event.target.value })
                }
                required
              />
            </label>
            <label>
              <span>Ціна</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={priceInput}
                onChange={(event) => {
                  const value = event.target.value;
                  setPriceInput(value);
                  if (value === '') {
                    setForm({ ...form, price: 0 });
                  } else {
                    const numValue = Number(value);
                    if (!isNaN(numValue) && numValue >= 0) {
                      setForm({ ...form, price: numValue });
                    }
                  }
                }}
                required
              />
            </label>
            <label>
              <span>Номер поїзда</span>
              <input
                type="text"
                value={form.trainNumber}
                onChange={(event) =>
                  setForm({ ...form, trainNumber: event.target.value })
                }
                required
              />
            </label>
            <div className="form-actions">
              <button className="primary-button" type="submit">
                {formMode === 'create' ? 'Додати' : 'Зберегти'}
              </button>
              {formMode === 'edit' && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={resetForm}
                >
                  Скасувати
                </button>
              )}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
