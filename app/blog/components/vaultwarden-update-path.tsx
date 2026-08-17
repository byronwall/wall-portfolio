import styles from './vaultwarden-update-path.module.css'

const phases = [
  {
    label: 'Check current state',
    kind: 'observe',
    steps: [
      {
        title: 'Find what is actually running',
        detail: '1.32.7 · persistent volume · container healthy',
      },
      {
        title: 'Find the compatible version',
        detail: 'Compatible target: 1.37.1',
      },
    ],
  },
  {
    label: 'Prove the backup',
    kind: 'prove',
    steps: [
      {
        title: 'Check the Restic snapshot',
        detail: 'Restic clean · database + WAL present',
      },
      {
        title: 'Create a clean SQLite backup',
        detail: 'Application-consistent snapshot created',
      },
    ],
  },
  {
    label: 'Do the update',
    kind: 'change',
    steps: [
      {
        title: 'Capture it off-server',
        detail: 'Checksum saved · off-server copy verified',
      },
      {
        title: 'Pull the image and replace the container',
        detail: 'The first change to the running service',
      },
    ],
  },
  {
    label: 'Check the result',
    kind: 'verify',
    steps: [
      {
        title: 'Check the version, logs, and endpoints',
        detail: '1.37.1 · clean startup · HTTP 200',
      },
      {
        title: 'Open the iOS app',
        detail: 'iOS works · rollback still available',
      },
    ],
  },
]

export function VaultwardenUpdatePath() {
  return (
    <figure className={`${styles.figure} not-prose`} aria-labelledby="update-path-title">
      <figcaption className={styles.header}>
        <h2 id="update-path-title">What I would have done. What Codex actually did.</h2>
        <p className={styles.intro}>
          I would have redeployed the container and hoped it came back. Codex checked every assumption before it touched the running service.
        </p>
      </figcaption>

      <div className={styles.comparison}>
        <section className={styles.before} aria-labelledby="before-title">
          <div className={styles.panelHeading}>
            <span className={styles.beforeMark} aria-hidden="true">×</span>
            <div>
              <p>My old process</p>
              <h3 id="before-title">Redeploy and hope</h3>
            </div>
          </div>

          <div className={styles.oldPath} aria-label="Old two-step process">
            <div className={styles.oldNode}>
              <span>01</span>
              <strong>Redeploy the container</strong>
            </div>
            <div className={styles.uncertainEdge} aria-hidden="true" />
            <div className={`${styles.oldNode} ${styles.hopeNode}`}>
              <span>?</span>
              <strong>Hope the vault comes back</strong>
            </div>
          </div>

          <p className={styles.beforeNote}>
            <strong>Checks I skipped</strong>
            <span>Target version · restore proof · result check</span>
          </p>
        </section>

        <section className={styles.after} aria-labelledby="after-title">
          <div className={styles.panelHeading}>
            <span className={styles.afterMark} aria-hidden="true">✓</span>
            <div>
              <p>What Codex did</p>
              <h3 id="after-title">Check first, then update</h3>
            </div>
          </div>

          <p className={styles.processRule}>The running service does not change until step 6.</p>

          <ol className={styles.verifiedPath} aria-label="Verified eight-step update process">
            {phases.map((phase, phaseIndex) => (
              <li className={styles.phase} data-kind={phase.kind} key={phase.label}>
                <div className={styles.phaseHeading}>
                  <span>{phase.label}</span>
                  <small>
                    {phaseIndex + 1} of {phases.length}
                    {phaseIndex === phases.length - 1 && <i aria-label="Complete">✓</i>}
                  </small>
                </div>
                <ol className={styles.phaseSteps}>
                  {phase.steps.map((step, stepIndex) => {
                    const number = phaseIndex * 2 + stepIndex + 1
                    return (
                      <li className={styles.step} key={step.title}>
                        <span className={styles.stepNumber}>{String(number).padStart(2, '0')}</span>
                        <span className={styles.stepCopy}>
                          <strong>{step.title}</strong>
                          <small>{step.detail}</small>
                        </span>
                      </li>
                    )
                  })}
                </ol>
                {phaseIndex < phases.length - 1 && <span className={styles.phaseEdge} aria-hidden="true" />}
              </li>
            ))}
          </ol>
        </section>
      </div>
    </figure>
  )
}
