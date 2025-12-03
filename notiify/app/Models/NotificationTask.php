<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotificationTask extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'operator_id',
        'races_data',
        'template',
        'template_id',
        'custom_message',
        'status',
        'total_recipients',
        'sent_count',
        'failed_count',
        'scheduled_at',
        'started_at',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'races_data' => 'array',
            'scheduled_at' => 'datetime',
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    // Связи
    public function operator()
    {
        return $this->belongsTo(User::class, 'operator_id');
    }

    // Для обратной совместимости
    public function creator()
    {
        return $this->operator();
    }

    public function templateRelation()
    {
        return $this->belongsTo(MessageTemplate::class, 'template_id');
    }

    // Для обратной совместимости
    public function template()
    {
        return $this->templateRelation();
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    /**
     * Получить массив ID рейсов из races_data
     */
    public function getRaceIds(): array
    {
        if (empty($this->races_data)) {
            return [];
        }

        return array_map(function ($race) {
            return $race['id'] ?? null;
        }, $this->races_data);
    }

    /**
     * Получить данные рейсов
     */
    public function getRacesData(): array
    {
        return $this->races_data ?? [];
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeProcessing($query)
    {
        return $query->where('status', 'processing');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    // Methods
    public function markAsProcessing(): void
    {
        $this->update([
            'status' => 'processing',
            'started_at' => now(),
        ]);
    }

    public function markAsCompleted(): void
    {
        $this->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);
    }

    public function markAsFailed(): void
    {
        $this->update([
            'status' => 'failed',
        ]);
    }

    public function incrementSentCount(): void
    {
        $this->increment('sent_count');
    }

    public function incrementFailedCount(): void
    {
        $this->increment('failed_count');
    }

    public function getSuccessRate(): float
    {
        if ($this->total_recipients === 0) {
            return 0;
        }

        return round(($this->sent_count / $this->total_recipients) * 100, 2);
    }
}



