import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
);

// Une couleur par mini-courbe (reprend la palette de l'application)
// Couleurs du cahier des charges : une couleur fixe par unité
const UNIT_COLORS = {
  M2: "#2A63A8", // bleu
  ML: "#E08A2E", // orange
  KG: "#4F8A3C", // vert
  M3: "#C04B3F", // rouge
};

// Pour les autres unités (Forfait, U…)
const OTHER_COLORS = ["#8A887F", "#1C3A5D", "#7794C0"];

const colorOf = (unit, index) =>
  UNIT_COLORS[String(unit).toUpperCase()] ??
  OTHER_COLORS[index % OTHER_COLORS.length];

/**
 * "Quantité réalisée par jour, par unité" : une mini-courbe par unité (M2, ML, KG…),
 * car les échelles sont trop différentes pour partager un même axe.
 */
const DashboardUnitChartsLayout = ({ labels = [], series = [] }) => {
  if (series.length === 0) {
    return (
      <p className="text-sm text-secondary-500 py-6">
        Aucune quantité saisie sur la période.
      </p>
    );
  }

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
                    borderColor: colorOf(serie.unit, index),
                    backgroundColor: colorOf(serie.unit, index),
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
