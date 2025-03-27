// pages/index.tsx
import AppointmentForm from '../components/AppointmentForm';
import StatisticsCards from '../components/StatisticsCards';

export default function Home() {
  return (
    <div>
      <AppointmentForm />
      <StatisticsCards />
    </div>
  );
}