/** GPU 가속 없이 CPU로 WebGL을 그리는 렌더러 이름(SwiftShader · llvmpipe · Windows 기본 렌더러 등) */
const softwareRenderer = /swiftshader|llvmpipe|softpipe|software|basic render/i;

/**
 * 3D 씬을 그릴 만한 WebGL2 환경인지 확인한다.
 * 소프트웨어 렌더러에서는 지금 캐릭터 모델(합계 약 180만 삼각형)을 그리는 동안 화면이 몇 초씩 멈춰서
 * HUD의 카운트다운·다이얼로그까지 늦어진다. 그런 환경에서는 3D 대신 placeholder를 보여준다.
 * TODO(에셋): 캐릭터 경량화본을 받으면 소프트웨어 렌더러에서도 그릴 수 있는지 다시 확인한다.
 */
export function canRenderSpaceScene() {
  const gl = document.createElement('canvas').getContext('webgl2');
  if (!gl) return false;
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer: unknown = gl.getParameter(
    debugInfo ? debugInfo.UNMASKED_RENDERER_WEBGL : gl.RENDERER,
  );
  // 확인용으로 만든 컨텍스트는 바로 돌려준다. 브라우저마다 동시에 쓸 수 있는 개수가 정해져 있다.
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  return typeof renderer !== 'string' || !softwareRenderer.test(renderer);
}
