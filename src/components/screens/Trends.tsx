import { useEffect, useState } from "react";
import { Header } from "../layout/Header";
import { Card } from "../common/Card";
import { Skeleton } from "../common/Skeleton";
import { useAppStore } from "../../store/appStore";
import styles from "./Trends.module.css";

export function Trends() {
  const { nights, logEvent } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<"7" | "30">("7");

  useEffect(() => {
    setTimeout(() => setLoading(false), 600);
    logEvent("view_trends", "trends");
  }, [logEvent]);

  const getRecentNights = () => {
    const days = range === "7" ? 7 : 30;
    return nights.slice(-days);
  };

  const recentNights = getRecentNights();

  const avgScore = recentNights.length
    ? Math.round(
        recentNights.reduce((sum, n) => sum + n.score, 0) / recentNights.length
      )
    : 0;

  // Calculate streak (consecutive nights with good score >= 70)
  let streak = 0;
  for (let i = recentNights.length - 1; i >= 0; i--) {
    if (recentNights[i].score >= 70) {
      streak++;
    } else {
      break;
    }
  }

  const avgPain = recentNights.length
    ? (
        recentNights
          .filter((n) => n.morningPainRating !== undefined)
          .reduce((sum, n) => sum + (n.morningPainRating || 0), 0) /
          recentNights.filter((n) => n.morningPainRating !== undefined).length
      ).toFixed(1)
    : "—";

  const painTrend = recentNights.length >= 2
    ? recentNights[recentNights.length - 1].morningPainRating! <
      recentNights[0].morningPainRating!
      ? "improving"
      : "steady"
    : "no data";

  const goodNights = recentNights.filter(n => n.score >= 70).length;

  return (
    <div className={styles.container}>
      <Header title="Trends" showSettings={false} />

      <div className={styles.content}>
        <div className={styles.rangeToggle}>
          <button
            className={`${styles.rangeBtn} ${range === "7" ? styles.active : ""}`}
            onClick={() => setRange("7")}
          >
            7 days
          </button>
          <button
            className={`${styles.rangeBtn} ${range === "30" ? styles.active : ""}`}
            onClick={() => setRange("30")}
          >
            30 days
          </button>
        </div>

        {loading ? (
          <>
            <Skeleton width="100%" height={150} borderRadius="var(--radius-lg)" />
            <Skeleton width="100%" height={150} borderRadius="var(--radius-lg)" />
          </>
        ) : recentNights.length < 3 ? (
          <Card className={styles.emptyState}>
            <p className={styles.emptyTitle}>Not enough data yet</p>
            <p className={styles.emptyText}>
              Come back after a few more nights to see your trends.
            </p>
          </Card>
        ) : (
          <>
            <Card className={styles.summaryCard}>
              <div className={styles.summaryGrid}>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryValue}>{streak}</span>
                  <span className={styles.summaryLabel}>
                    {streak === 1 ? "Night" : "Night Streak"} 🔥
                  </span>
                  <p className={styles.summaryDetail}>Consecutive nights with good score</p>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryValue}>{goodNights}</span>
                  <span className={styles.summaryLabel}>Good Nights</span>
                  <p className={styles.summaryDetail}>Score of 70 or higher</p>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryValue}>{avgScore}</span>
                  <span className={styles.summaryLabel}>Weekly Avg</span>
                  <p className={styles.summaryDetail}>Your posture score</p>
                </div>
              </div>
            </Card>

            <Card>
              <p className={styles.cardTitle}>Posture Score Trend</p>
              <div className={styles.chart}>
                {recentNights.map((night, idx) => (
                  <div
                    key={idx}
                    className={styles.chartBar}
                    title={`${night.date}: ${night.score}`}
                  >
                    <div
                      className={styles.barValue}
                      style={{ height: `${(night.score / 100) * 100}%` }}
                    ></div>
                    <span className={styles.barDate}>
                      {new Date(night.date).getDate()}
                    </span>
                  </div>
                ))}
              </div>
              <div className={styles.statRow}>
                <span className={styles.statLabel}>Average</span>
                <span className={styles.statValue}>{avgScore}</span>
              </div>
            </Card>

            <Card>
              <p className={styles.cardTitle}>Morning Pain Level</p>
              {recentNights.filter((n) => n.morningPainRating !== undefined)
                .length > 0 ? (
                <>
                  <div className={styles.painChart}>
                    {recentNights
                      .filter((n) => n.morningPainRating !== undefined)
                      .map((night, idx) => (
                        <div
                          key={idx}
                          className={styles.painDot}
                          style={{
                            background:
                              night.morningPainRating! < 4
                                ? "var(--success)"
                                : night.morningPainRating! < 7
                                  ? "var(--warning)"
                                  : "var(--error)",
                          }}
                          title={`${night.date}: ${night.morningPainRating}`}
                        ></div>
                      ))}
                  </div>
                  <div className={styles.statRow}>
                    <span className={styles.statLabel}>Average</span>
                    <span className={styles.statValue}>{avgPain}</span>
                  </div>
                  <p className={styles.trendText}>
                    Your neck pain is{" "}
                    <strong>
                      {painTrend === "improving"
                        ? "lower than before"
                        : "holding steady"}
                    </strong>
                    .
                  </p>
                </>
              ) : (
                <p className={styles.noData}>
                  Rate your morning pain to see trends.
                </p>
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
