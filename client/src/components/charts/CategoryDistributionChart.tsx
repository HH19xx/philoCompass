import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

type DataPoint = {
  score: number;
  count: number;
};

type Props = {
  categoryName: string;
  data: DataPoint[];
  userScore: number;
};

const CategoryDistributionChart: React.FC<Props> = ({ categoryName, data, userScore }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data || data.length === 0) return;

    // SVGの既存内容をクリア
    d3.select(svgRef.current).selectAll('*').remove();

    // グラフの寸法設定
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const width = 300 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    // SVG要素を作成
    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X軸のスケール設定（スコア: -6 ~ +6）
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.score.toString()))
      .range([0, width])
      .padding(0.1);

    // Y軸のスケール設定（人数: 0 ~ 最大値）
    const maxCount = d3.max(data, (d) => d.count) || 10;
    const yScale = d3.scaleLinear().domain([0, maxCount]).range([height, 0]);

    // X軸を描画
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .style('font-size', '10px');

    // Y軸を描画
    svg
      .append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .style('font-size', '10px');

    // 棒グラフを描画
    svg
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => xScale(d.score.toString()) || 0)
      .attr('y', (d) => yScale(d.count))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => height - yScale(d.count))
      .attr('fill', (d) => (d.score === userScore ? '#dc3545' : '#4caf50')); // ユーザースコアは赤、その他は緑

    // ユーザースコア位置に縦線を引く
    const userX = xScale(userScore.toString());
    if (userX !== undefined) {
      svg
        .append('line')
        .attr('x1', userX + xScale.bandwidth() / 2)
        .attr('x2', userX + xScale.bandwidth() / 2)
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', '#dc3545')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '4,4');
    }

    // グラフタイトル
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', -5)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .text(categoryName);
  }, [data, userScore, categoryName]);

  return <svg ref={svgRef}></svg>;
};

export default CategoryDistributionChart;
