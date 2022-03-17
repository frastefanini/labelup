export function isLicensingEnabled() {
  const buildTarget = process.env.BUILD_TARGET
  return buildTarget.toLowerCase() === 'marketplace'
}
