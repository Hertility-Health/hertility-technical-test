'use client';

import * as React from 'react';
import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import clsx from 'clsx';
import { Anomaly, AnomalyKind, HormoneResults } from '../types';
import { Info } from 'lucide-react';

function Popover({ ...props }: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({ ...props }: PopoverPrimitive.Trigger.Props) {
  return (
    <PopoverPrimitive.Trigger
      data-slot="popover-trigger"
      className={clsx(
        'cursor-pointer transition-colors hover:border-gray-400 hover:bg-gray-50',
        props.className,
      )}
      {...props}
    />
  );
}

function PopoverContent({
  className,
  align = 'start',
  alignOffset = 0,
  side = 'right',
  sideOffset = 4,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<PopoverPrimitive.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset'>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={clsx(
            'z-50 flex w-72 flex-col gap-2.5 rounded-sm border border-gray-200 bg-white/50 backdrop-blur-3xl p-2.5 text-sm text-black opacity-100 shadow-md outline-hidden',
            className,
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

function PopoverHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="popover-header"
      className={clsx('flex flex-col gap-0.5 text-sm', className)}
      {...props}
    />
  );
}

function PopoverTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="popover-title"
      className={clsx('block text-base font-semibold leading-5 text-black opacity-100', className)}
      {...props}
    />
  );
}

function PopoverDescription({ className, ...props }: PopoverPrimitive.Description.Props) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className={clsx('text-gray-700', className)}
      {...props}
    />
  );
}

export function AnomalyPopover({ anomalies }: { anomalies: Array<Anomaly> }) {
  const triggerText = `${anomalies.length} ${anomalies.length > 1 ? 'anomalies' : 'anomaly'}`;
  return (
    <>
      <Popover>
        <PopoverTrigger
          aria-label={`View ${triggerText}`}
          className="inline-flex items-center gap-1 rounded-sm border border-gray-300 px-2 py-1 text-gray-700 cursor-pointer hover:bg-red-600 hover:text-white"
        >
          <Info className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="text-xs leading-none">{anomalies.length}</span>
        </PopoverTrigger>
        <PopoverContent>
          {anomalies.map((anomaly) => (
            <PopoverHeader key={anomaly.hormone}>
              <PopoverTitle>{anomaly.hormone}</PopoverTitle>
              <PopoverDescription className="space-y-1">
                <div>
                  Status:{' '}
                  <span
                    className={clsx(
                      'rounded px-1.5 py-0.5 text-xs font-medium',
                      anomaly.kind === AnomalyKind.Over
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700',
                    )}
                  >
                    {anomaly.kind}
                    {anomaly.kind === AnomalyKind.Over
                      ? ` (+${anomaly.value} ${anomaly.units})`
                      : ` (-${anomaly.value} ${anomaly.units})`}
                  </span>
                </div>
                <div>
                  Expected: {anomaly.target.min} to {anomaly.target.max} {anomaly.units}
                </div>
              </PopoverDescription>
            </PopoverHeader>
          ))}
        </PopoverContent>
      </Popover>
    </>
  );
}

export function HormoneResultsPopover({
  hormoneResults,
}: {
  hormoneResults: Array<HormoneResults>;
}) {
  const triggerLabel = `${hormoneResults.length} ${hormoneResults.length > 1 ? 'results' : 'result'}`;

  return (
    <Popover>
      <PopoverTrigger
        aria-label={`View ${triggerLabel}`}
        className="inline-flex items-center gap-1 rounded-sm border border-gray-300 px-2 py-1 text-gray-700 cursor-pointer hover:bg-amber-600 hover:text-white"
      >
        <Info className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="text-xs leading-none">{hormoneResults.length}</span>
      </PopoverTrigger>
      <PopoverContent className="max-h-94 overflow-auto ">
        {hormoneResults.map((hormoneResult) => (
          <PopoverHeader
            key={hormoneResult.code}
            className={clsx(
              'rounded p-1',
              hormoneResult.inRange === false && 'bg-red-100 border border-red-200',
            )}
          >
            <PopoverTitle>{hormoneResult.code}</PopoverTitle>
            <PopoverDescription>
              {hormoneResult.value} {hormoneResult.units} -{' '}
              {hormoneResult.inRange ? 'In range' : 'Out of range'}
            </PopoverDescription>
          </PopoverHeader>
        ))}
      </PopoverContent>
    </Popover>
  );
}
