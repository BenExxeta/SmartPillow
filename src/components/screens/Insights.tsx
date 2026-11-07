import { useEffect, useState } from "react";
import { Header } from "../layout/Header";
import { Card } from "../common/Card";
import { Skeleton } from "../common/Skeleton";
import { useAppStore } from "../../store/appStore";
import styles from "./Insights.module.css";
import { TrendingUp, Heart, Moon, Zap, CheckCircle, AlertCircle } from "lucide-react";

export function Insights() {
  const { nights, logEvent } = useAppStore();
  const [loading, setLoading] = useState(true);

  const today = nights[nights.length - 1];
  const last7 = nights.slice(-7);
  const avgScore = Math.round(last7.reduce((sum, n) => sum + n.score, 0) / last7.length);

  useEffect(() => {
    setTimeout(() => setLoading(false), 600);
    logEvent("view_insights", "insights");
  }, [logEvent]);

  const tips = [
    {
      icon: Heart,
      title: "Maintain good posture",
      detail: "Keep your pillow at the right height—avoid putting too much pressure on your neck.",
      priority: "high",
      positionAdvice: "Back sleeping is ideal for neck alignment",
    },
    {
      icon: Moon,
      title: "Aim for 7-9 hours",
      detail: `You got ${today.sleepDuration.toFixed(1)}h last night. Consistency is key for better posture scores.`,
      priority: "medium",
      positionAdvice: "Try to sleep 7-9 hours nightly",
    },
    {
      icon: Zap,
      title: "Reduce position changes",
      detail: `${today.positionChangeCount} changes last night. Try to stay on your back for longer periods.`,
      priority: "medium",
      positionAdvice: "Back position: Stay longer in one position",
    },
    {
      icon: CheckCircle,
      title: "Cool your room",
      detail: "64-68°F (18-20°C) is ideal for sleep quality and reduces tossing.",
      priority: "low",
      positionAdvice: "Better sleep position stability",
    },
  ];

  return (
    <div className={styles.container}>
      <Header title="Sleep Insights" showSettings={false} syncStatus={`7-day avg: ${avgScore}`} />

      <div className={styles.content}>
        {loading ? (
          <>
            <Skeleton width="100%" height={120} borderRadius="var(--radius-lg)" />
            <Skeleton width="100%" height={100} borderRadius="var(--radius-lg)" />
          </>
        ) : (
          <>
            <Card className={styles.summaryCard}>
              <div className={styles.summaryHeader}>
                <TrendingUp size={20} className={styles.trendIcon} />
                <h2 className={styles.summaryTitle}>Your Week in Numbers</h2>
              </div>
              <div className={styles.statsGrid}>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{avgScore}</span>
                  <span className={styles.statLabel}>Avg Score</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statValue}>
                    {(last7.reduce((sum, n) => sum + n.sleepDuration, 0) / 7).toFixed(1)}h
                  </span>
                  <span className={styles.statLabel}>Avg Sleep</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statValue}>
                    {last7.filter(n => n.riskLevel === "low").length}
                  </span>
                  <span className={styles.statLabel}>Good Nights</span>
                </div>
              </div>
            </Card>

            <div className={styles.tipsSection}>
              <h3 className={styles.tipsTitle}>💡 Tips to Improve Your Posture Score</h3>
              <div className={styles.tipsList}>
                {tips.map((tip, idx) => {
                  const Icon = tip.icon;
                  const priorityColor =
                    tip.priority === "high"
                      ? "high"
                      : tip.priority === "medium"
                        ? "medium"
                        : "low";
                  return (
                    <Card
                      key={idx}
                      className={`${styles.tipCard} ${styles[`priority-${priorityColor}`]}`}
                    >
                      <div className={styles.tipHeader}>
                        <Icon size={20} className={styles.tipIcon} />
                        <h4 className={styles.tipTitle}>{tip.title}</h4>
                      </div>
                      <p className={styles.tipDetail}>{tip.detail}</p>
                      <div className={styles.positionSection}>
                        <svg className={styles.positionIcon} viewBox="0 0 40 60" xmlns="http://www.w3.org/2000/svg">
                          <ellipse cx="20" cy="12" rx="6" ry="8" fill="currentColor" />
                          <path d="M 20 20 Q 20 30 15 40 L 10 50 L 15 50 L 20 40 L 25 50 L 30 50 L 25 40 Q 20 30 20 20" fill="currentColor" opacity="0.7" />
                        </svg>
                        <span className={styles.positionAdvice}>{tip.positionAdvice}</span>
                      </div>
                      {tip.priority === "high" && (
                        <div className={styles.priorityBadge}>
                          <AlertCircle size={14} /> Priority
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
