import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { format, parseISO } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
);

// Une couleur par mini-courbe (reprend la palette de l'application)
const COLORS = [
  "#C94D25",
  "#6c2c22",
  "#de8559",
  "#853327",
  "#e8ae89",
  "#a63e28",
];

/**
 * "Quantité réalisée par jour, par unité" : une mini-courbe par unité (M2, ML, KG…),
 * car les échelles sont trop différentes pour partager un même axe.
 */
const DashboardUnitChartsLayout = ({ days = [], series = [] }) => {
  if (series.length === 0) {
    return (
      <p className="text-sm text-secondary-500 py-6">
        Aucune quantité saisie sur la période.
      </p>
    );
  }

  const labels = days.map((day) => format(parseISO(day), "dd/MM"));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {series.map((serie, index) => (
        <div
          key={serie.unit}
          className="rounded-md border border-primary-100 p-3"
        >
          <p className="font-semibold mb-2">
            {serie.unit}
            {serie.categories?.length > 0 && (
              <span className="font-normal">
                {" "}
                ({serie.categories.join(" / ")})
              </span>
            )}
          </p>
          <div className="h-[180px]">
            <Line
              data={{
                labels,
                datasets: [
                  {
                    label: serie.unit,
                    data: serie.values,
                    borderColor: COLORS[index % COLORS.length],
                    backgroundColor: COLORS[index % COLORS.length],
                    borderWidth: 2,
                    pointRadius: 3,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { display: false } },
                  y: { beginAtZero: true },
                },
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardUnitChartsLayout;
