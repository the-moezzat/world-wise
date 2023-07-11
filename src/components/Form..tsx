// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from 'react';

import styles from './Form.module.css';
import { useUrlPosition } from '../hooks/useUrlPosition';
import { useCities } from '../contexts/CitiesContext';
import Message from './Message.';
import Spinner from './Spinner.';
import Button from './Button';
import ButtonBack from './ButtonBack';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export function convertToEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [cityName, setCityName] = useState('');
  const [country, setCountry] = useState('');
  const [emoji, setEmoji] = useState('');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');

  const [lat, lng] = useUrlPosition();

  const { addCity, isLoading: appLoading } = useCities();

  useEffect(
    function () {
      async function fetching() {
        try {
          setError('');
          setIsLoading(true);

          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();

          if (!data.countryCode)
            throw new Error("It Seems that you haven't choosen valid city");

          setCityName(data.city || data.locality || '');
          setCountry(data.countryName);
          setEmoji(convertToEmoji(data.countryCode));
        } catch ({ message }) {
          setError(message);
        } finally {
          setIsLoading(false);
        }
      }

      fetching();
    },
    [lat, lng]
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await addCity({
      cityName,
      country,
      date: date.toDateString(),
      emoji,
      notes,
      position: { lat: Number(lat), lng: Number(lng) },
    });

    navigate('/app/cities');
  }

  if (isLoading) return <Spinner />;
  if (error) return <Message message={error} />;

  return (
    <>
      <form
        className={`${styles.form} ${appLoading ? styles.loading : ''}`}
        onSubmit={handleSubmit}
      >
        <div className={styles.row}>
          <label htmlFor="cityName">City name</label>
          <input
            id="cityName"
            onChange={(e) => setCityName(e.target.value)}
            value={cityName}
          />
          <span className={styles.flag}>{emoji}</span>
        </div>

        <div className={styles.row}>
          <label htmlFor="date">When did you go to {cityName}?</label>
          <DatePicker
            id="date"
            dateFormat={'dd/MM/yyyy'}
            selected={date}
            onChange={(date) => setDate(date)}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="notes">Notes about your trip to {cityName}</label>
          <textarea
            id="notes"
            onChange={(e) => setNotes(e.target.value)}
            value={notes}
          />
        </div>

        <div className={styles.buttons}>
          <Button type={'primary'}>Add</Button>
          <ButtonBack />
        </div>
      </form>
    </>
  );
}

export default Form;
