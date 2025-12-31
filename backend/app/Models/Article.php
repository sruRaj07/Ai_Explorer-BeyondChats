<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'source_url',
        'original_content',
        'updated_content',
        'references',
        'scraped_at'
    ];

    protected $casts = [
        'references' => 'array',
    ];
}