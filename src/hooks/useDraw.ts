import { useCallback, useEffect, useRef, useState } from "react"



// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useDraw = () => {
  const [color, setColor] = useState("#ffffff")
  const [mouseDown, setMouseDown] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prevPoint = useRef<null | Point>(null)

  const drawLine = useCallback(function ({ prevPoint, currentPoint, ctx }: Draw) {
    const { x: currX, y: currY } = currentPoint;
    const lineWidth = 5;
    const startPoint = prevPoint ?? currentPoint;

    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(currX, currY);
    ctx.stroke();

    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
    ctx.fill();
  }, [color])


  const clear = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const computePointInCanvas = (e: MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y }
  }
  const download = ()=>{
    const link = document.createElement('a');
    link.download = 'filename.png';
    link.href = canvasRef.current!.toDataURL()
    link.click();
  }
  const onMouseDown = () => setMouseDown(true)
  const onMouseUp = () => {
    setMouseDown(false)
    prevPoint.current = null
  }

  useEffect(() => {
    const handleEvent = (e: MouseEvent) => {
      if (!mouseDown) return

      const currentPoint = computePointInCanvas(e)
      const ctx = canvasRef.current?.getContext("2d")

      if (!ctx || !currentPoint) return

      drawLine({ ctx, currentPoint, prevPoint: prevPoint.current })
      prevPoint.current = currentPoint
    }

    canvasRef.current?.addEventListener("mousemove", handleEvent)
    window.addEventListener("mouseup", onMouseUp)

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      canvasRef.current?.removeEventListener("mousemove", handleEvent)
      window.removeEventListener("mouseup", onMouseUp)
    }
  }, [mouseDown, drawLine])

  return {
    canvasRef,
    onMouseDown,
    setColor,
    color,
    clear,
    download
  }

}