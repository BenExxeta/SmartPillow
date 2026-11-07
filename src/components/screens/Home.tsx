import { useEffect, useState } from "react";
import { Header } from "../layout/Header";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { Skeleton } from "../common/Skeleton";
import { useAppStore } from "../../store/appStore";
import styles from "./Home.module.css";
import { TrendingDown, Moon, Zap, HelpCircle, ChevronRight, Heart, Lock } from "lucide-react";

export function Home() {
  const {
    nights,
    setCurrentScreen,
    recordHomeViewTime,
    logEvent,
  } = useAppStore();

  const [loading, setLoading] = useState(true);
  const [showScoreInfo, setShowScoreInfo] = useState(false);
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);

  const today = nights[nights.length - 1];
  const yesterday = nights.length > 1 ? nights[nights.length - 2] : null;

  useEffect(() => {
    setTimeout(() => setLoading(false), 600);
    recordHomeViewTime();
    logEvent("view_home", "home");
  }, [logEvent, recordHomeViewTime]);

  const scoreTrend = yesterday && today.score > yesterday.score ? "up" : "down";
  const neckAlignmentMax = Math.max(...today.neckAlignment.map(a => a.alignment));

  const tips = [
    {
      id: "tip-1",
      icon: Heart,
      title: "Adjust your pillow height",
      reason: "Right-side sleeping needs better neck support",
      position: "back" as const,
    },
    {
      id: "tip-2",
      icon: Zap,
      title: "Morning neck stretch",
      reason: "Loosen muscles after extended right-side time",
      position: "back" as const,
    },
  ];

  const insights = [
    { id: "sleep-duration", icon: Moon, label: `${today.sleepDuration.toFixed(1)}h sleep`, detail: "Target: 7-9 hours" },
    { id: "alignment", icon: Zap, label: `Neck alignment: ${neckAlignmentMax}%`, detail: "How well your neck was aligned" },
    { id: "trend", icon: TrendingDown, label: "Trend", detail: scoreTrend === "up" ? "+3 pts vs yesterday" : "-2 pts vs yesterday" },
  ];

  return (
    <div className={styles.container}>
      <Header title="Your Sleep Report" showSettings={false} syncStatus="Last night" />

      <div className={styles.content}>
        <div className={styles.heroSection}>
          <img src="/morning.jpg" alt="Good morning" className={styles.heroImage} />
          <div className={styles.heroOverlay} />
          <div className={styles.heroText}>
            <p className={styles.heroGreeting}>Good morning! ☀️</p>
          </div>
        </div>

        {loading ? (
          <>
            <Skeleton width="100%" height={140} borderRadius="var(--radius-lg)" />
            <Skeleton width="100%" height={80} borderRadius="var(--radius-lg)" />
          </>
        ) : (
          <>
            <div className={styles.centerContent}>
              <div className={styles.scoreSection}>
                <Card
                  className={styles.scoreCard}
                  onClick={() => {
                    setCurrentScreen("insights");
                    logEvent("click_score_to_insights", "home");
                  }}
                >
                  <div className={styles.scoreHeader}>
                    <span className={styles.scoreTitle}>Posture Score</span>
                    <button
                      className={styles.scoreInfoBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowScoreInfo(!showScoreInfo);
                        logEvent("toggle_score_info", "home");
                      }}
                      aria-label="Score explanation"
                    >
                      <HelpCircle size={16} />
                    </button>
                  </div>
                  <div className={styles.scoreCircle}>
                    <span className={styles.score}>{today.score}</span>
                    <span className={styles.scoreOutOf}>/100</span>
                  </div>
                  <p className={styles.scoreCaption}>How well your neck was aligned last night</p>
                </Card>
              </div>

              {showScoreInfo && (
                <Card className={styles.scoreExplanation}>
                  <p className={styles.scoreExplainTitle}>How is your Posture Score calculated?</p>
                  <ul className={styles.scoreExplainList}>
                    <li><strong>90-100:</strong> Excellent alignment & sleep quality</li>
                    <li><strong>70-89:</strong> Good alignment, small improvements possible</li>
                    <li><strong>50-69:</strong> Average alignment, consider our tips</li>
                    <li><strong>&lt;50:</strong> Poor alignment, prioritize adjustments</li>
                  </ul>
                  <p className={styles.scoreExplainFooter}>Based on sleep duration, sleeping position, and neck alignment throughout the night.</p>
                </Card>
              )}

              {/* Risk/Alignment Card */}
              <Card className={`${styles.riskCard} ${styles[`risk-${today.riskLevel}`]}`}>
                <div className={styles.riskContent}>
                  <Heart size={20} />
                  <div className={styles.riskText}>
                    <p className={styles.riskLabel}>
                      {today.riskLevel === "high"
                        ? "High neck strain detected"
                        : today.riskLevel === "medium"
                          ? "Moderate neck alignment"
                          : "Excellent neck alignment!"}
                    </p>
                    <p className={styles.riskDetail}>
                      {today.mainReason}
                    </p>
                  </div>
                </div>
              </Card>

              {/* What to Change Tonight Section */}
              <div className={styles.tipsSection}>
                <h3 className={styles.tipsHeading}>💡 What to change tonight</h3>
                <div className={styles.tipsList}>
                  {tips.slice(0, 2).map((tip) => {
                    const Icon = tip.icon;
                    return (
                      <Card key={tip.id} className={styles.tipCard}>
                        <div className={styles.tipContent}>
                          <Icon size={18} className={styles.tipIcon} />
                          <div className={styles.tipText}>
                            <h4 className={styles.tipTitle}>{tip.title}</h4>
                            <p className={styles.tipDetail}>{tip.reason}</p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <Button
                variant="primary"
                onClick={() => {
                  setCurrentScreen("insights");
                  logEvent("click_see_insights", "home");
                }}
                className={styles.seeInsightsBtn}
              >
                See detailed insights <ChevronRight size={18} />
              </Button>

              <div className={styles.insightsGrid}>
                {insights.map(({ id, icon: Icon, label, detail }) => (
                  <Card
                    key={id}
                    className={`${styles.insightCard} ${expandedInsight === id ? styles.expanded : ""}`}
                    onClick={() => {
                      setExpandedInsight(expandedInsight === id ? null : id);
                      logEvent(`click_insight_${id}`, "home");
                    }}
                  >
                    <Icon size={24} className={styles.insightIcon} />
                    <p className={styles.insightLabel}>{label}</p>
                    {expandedInsight === id && (
                      <p className={styles.insightDetail}>{detail}</p>
                    )}
                  </Card>
                ))}
              </div>

              {/* Privacy Notice */}
              <Card className={styles.privacyCard}>
                <div className={styles.privacyContent}>
                  <Lock size={16} />
                  <p className={styles.privacyText}>Your sleep data stays on your device—we never store it on our servers.</p>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
