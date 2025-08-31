export default function StatCard({ title, value, subtitle, icon }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <div className="flex items-center">
        <div className="text-2xl mr-3">{icon}</div>
        <div>
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">{title}</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {subtitle && <span className="text-sm text-gray-500">{subtitle}</span>}
        </div>
      </div>
    </div>
  );
}